import jwt from 'jsonwebtoken';

export default (req,res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
//удаляем не нужный нам bearer
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret') //расшифровываем токен
            req.userId = decoded._id
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    }
    else
        {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    }
