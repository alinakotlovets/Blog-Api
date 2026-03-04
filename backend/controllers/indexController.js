export function getIndexPageInfo(req, res){
    let response;
    if(req.user){
        response = {
            user: {
                id: req.user.id,
                username: req.user.username,
                role: req.user.role
            }
        };
    } else {
        response = {
            user: null
        }
    }
    return res.status(200).json(response)
}