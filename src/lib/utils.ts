import path from 'path' 
import userProfile from '../../profile.json' 

export function getProfile(key?:keyof typeof userProfile){
    if(key) userProfile[key]
    return userProfile
 }