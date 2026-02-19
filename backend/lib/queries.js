import {prisma} from "./prisma.js";

export async function addUserToBd(username, password){
    return prisma.user.create({data: {
            username: username,
            password: password
        }})
}

export async function getUserByUsername(username){
    return prisma.user.findUnique({where: {username: username}});
}