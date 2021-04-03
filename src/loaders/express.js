const express = require('express');
const cors = require('cors');

const api = require('../apis');


module.exports = (app) => {
    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        console.log(`[recieve] ${req.method} ${req.url} ${req.get('Authorization')}`);
        next();
    });
    
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store')
        next()
    });

    app.use('/', api);
    
    app.use((err, req, res, next) => {
        const status = err.status || 500;
        let message;
        if(status == 500) {
            message = '서버에 오류가 발생했습니다.';
        }
        else {
            message = err.message;
        }
        
        console.log(
            `${req.method} ${req.url} ${status} : ${message}`
        );
        if(err.captureStackTrace) {
            console.log(err.captureStackTrace());
        } 
        else if(err.stack){
            console.log(err.stack);
        }

        res.status(status);
        res.json({
            message,
            status
        });
    });

};
