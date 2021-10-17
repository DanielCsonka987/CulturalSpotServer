const path = require('path')
const fs = require('fs')

module.exports.getTheComponentSourcePath = (summPathArray)=>{
    let localPath = path.join(__dirname)
    for(const item of summPathArray){
        localPath = path.join(localPath, item)
    }
    return localPath
}

module.exports.getTheFetchedReplacedContent = async (linksArray, 
    pathToFetch, contentFileDef, contentTypeDef)=>{
    try{
        const content = await getTheFormattedContent(linksArray, pathToFetch, 
            contentFileDef, contentTypeDef
        )
        return {
            report: `${contentTypeDef.toLowerCase()}Packed`,
            content
        }
    }catch(err){
        return {
            report: `${contentTypeDef.toLowerCase()}Missing`,
            content: ''
        }
    }
}

async function getTheFormattedContent(linksArray, 
    theTextRoot, theFileName, contentType){
    const theText = await getTheContentFromFile(theTextRoot, theFileName)
    if(!theText){
        return ''
    }

    let resultText = theText
    for(const link of linksArray){
        const temp = resultText.replace(
            link.getTheDestinationMarkerText(),
            link.getTheProperLink(contentType)
        )
        resultText = temp
    }
    return resultText
} 


function getTheContentFromFile(localPath, filename){
    return new Promise((resolve, reject)=>{
        const fullpath = path.join(localPath, filename)
        fs.readFile(fullpath, 'utf8', (err, text)=>{
            if(err){
                console.log(err)
                reject('');
            }
            resolve(text)
        })
    })
}