var Database = require('../models');
Database.sequelize.sync();

var Recruiters = require('../models').Recruiters;
var Companies = require('../models').Companies;
var JobWebsites = require('../models').JobWebsites;

var recruiters;
var companies;
var jobsites;
var data;

var createDatabase = {
	selectAll: function(cb){
        Recruiters.findAll({}).then(function(success){
        		recruiters = success;
        Companies.findAll({}).then(function(success){
                companies = success;
        JobWebsites.findAll({}).then(function(success){
        		jobsites = success;
        		data = {
        			recruiters: recruiters,
        			companies: companies,
        			jobsites: jobsites
        		}
        		cb(data);
        		})
        	})
        })
    }
};

module.exports['exportData'] = createDatabase;
    

