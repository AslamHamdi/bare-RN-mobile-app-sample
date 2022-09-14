const Post = require('../class/level1')

exports.initDb= async() => {
    try {
        let data = new Post()
        data = await data.initDb()
        return data
    } catch (error) {
        console.log("ROUTER ERROR: ", error)
        next(error)
    }
}

exports.getAllReport = async() => {
    try {
        let data = new Post()
        data = await data.getAllReport()
        return data
    } catch (error) {
        console.log("ROUTER ERROR: ", error)
        next(error)
    }
}

exports.deleteAllReport = async() => {
    try {
        let data = new Post()
        data = await data.deleteAllReport()
        return data
    } catch (error) {
        console.log("ROUTER ERROR: ", error)
        //next(error)
    }
}

exports.addNewReport = async(payload) => {
    //console.log("ROUTER PAYLOD: ", payload)
    try {
        let data = new Post()
        data = await data.addNewReport(payload)
        return data
    } catch (error) {
        console.log("ROUTER ERROR: ", error)
        //next(error)
    }
}