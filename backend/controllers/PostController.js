import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
      const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
     PostModel.findOneAndUpdate(
            {_id:postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: 'after'}).then(
            (doc,err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: 'Не удалось получить статью',
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    })
                }
                res.json(doc);
            }
            )

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete(
            {_id:postId},
            ).then(
            (doc,err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: 'Не удалось удалить статью',
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    })
                }
                res.json({
                    success: true,
                })
            }
        )

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статьи',
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.updateOne(
            {_id:postId},
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }).then(res.json({
            success: true
        }))


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статьи',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};