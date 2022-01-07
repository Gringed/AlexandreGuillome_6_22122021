const Sauce = require('../models/sauces');

const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce Ajoutée' }))
        .catch(error => res.status(401).json({ error }));
};

exports.likedSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((like) => {
        const usersLikeDislike = req.body.userId;
        if(req.body.like === 1){ 
            const likesMore = +1;
            Sauce.updateOne({ _id: req.params.id}, {$push: {usersLiked: usersLikeDislike}, $inc: {likes: likesMore}, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce likée !'}))
            .catch(error => res.status(404).json({error}))
        }
        else if(req.body.like === 0){
            if (like.usersLiked.includes(usersLikeDislike)) {
                likesLess = -1;
                Sauce.updateOne({ _id: req.params.id}, {$pull: {usersLiked: usersLikeDislike}, $inc: {likes: likesLess }})
                .then(() => res.status(200).json({message : 'Aucun avis sur la sauce !'}))
                .catch(error => res.status(404).json({error}))
            }
            if (like.usersDisliked.includes(usersLikeDislike)) {
                dislikeLess = -1;
                Sauce.updateOne({ _id: req.params.id}, {$pull: {usersDisliked: usersLikeDislike }, $inc: {dislikes: dislikeLess}})
                .then(() => res.status(200).json({message : 'Aucun avis sur la sauce !'}))
                .catch(error => res.status(404).json({error}))
            }
        }
        else if(req.body.like === -1){
            const dislikeMore = +1;
            Sauce.updateOne({ _id: req.params.id}, {$push: {usersDisliked: usersLikeDislike}, $inc: {dislikes: dislikeMore}, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce dislikée !'}))
            .catch(error => res.status(404).json({error}))
        }
        
    })
    .catch(error => console.log(error));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message : 'Sauce modifié'}))
    .catch(error => res.status(404).json({error}))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if(!sauce) {
            return res.status(404).json({ error: new Error('Sauce non trouvée') });
        }
        if(sauce.userId !== req.auth.userId){
            return res.status(401).json({ error: new Error('Requête 1 non autorisée') });
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({message: 'Sauce supprimée'}))
            .catch(error => res.status(404).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};

exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.findAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};