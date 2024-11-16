import db from '../DB/mysql.js'

const TABLE = 'users';

const UserModel = {
    createRecord: (data) => db.createRecord(TABLE, data),
    updateRecord: (data, conditions = {}) => db.updateRecord(TABLE, data, conditions),
    findRecords: (conditions = {}, limit = null) => db.findRecords(TABLE, conditions, limit),
    findOneRecord: (conditions = {}) => db.findOneRecord(TABLE, conditions),
    deleteRecord: (conditions = {}) => db.deleteRecord(TABLE, conditions)
};

export default {UserModel};