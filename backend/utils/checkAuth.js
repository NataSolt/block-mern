import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');

            req.userId = decoded._id;

            next();
        } catch (e) {
            return res.status(402).json({

                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};

// import jwt from 'jsonwebtoken';
//
// export default (req,res, next) => {
//     const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
//
//
// //удаляем не нужный нам bearer
//     if (token) {
//         try {
//             const decoded = jwt.verify(token, 'secret123');//расшифровываем токен
//
//             req.userId = decoded._id;
//
//             next();
//         } catch (err) {
//             console.log(req.body, 1)
//             return res.status(403).json({
//                 message: 'Нет доступа1'
//
//             })
//         }
//
//     }
//     else
//         {
//             return res.status(403).json({
//                 message: 'Нет доступа2'
//             })
//         }
//     }
