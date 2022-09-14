import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('db.testDb')

class Post{
    constructor(data){
        this.data = data
    }

    async initDb(){
        db.transaction(tx => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS report_list (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, ic_num INT, email TEXT)'
            )
        })
        return true
    }

    async getAllReport() {
        await this.initDb()
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM report_list', [], 
            (txObj, result) => resolve(result), 
            (txObj, error) => reject(error));
          });
        });
    }

    async deleteAllReport() {
        await this.initDb()
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql('DELETE FROM report_list', [], 
            (txObj, result) => resolve(result), 
            (txObj, error) => reject(error));
          });
        });
    }

    async addNewReport(payload){
        await this.initDb()
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql('INSERT INTO report_list (full_name, ic_num, email) values (?, ?, ?)', [payload.name, payload.icNum, payload.email], 
              (txObj, result) => resolve(result), 
              (txObj, error) => reject(error));
            });
        });
    }
}

module.exports = Post