import express from 'express';
import catalyst from 'zcatalyst-sdk-node';
import moment from 'moment';
import objects from './db/objects.js';
import { join, dirname } from 'path';
import type { ICatalystUser } from 'zcatalyst-sdk-node/lib/utils/pojo/common.js';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), '../public')));


const { alienCity } = objects;


// const tableName = 'Alien City'; // The table created in the Data Store
// const columnName = 'CityName'; // The column created in the table

app.use(/^\/?$/, (req, res) => {
    console.log('redirecting');
    res.redirect('/index.html');
});

app.use('/api', async (req, res, next) => {
    const catalystApp = catalyst.initialize(req as unknown as Record<string, unknown>);
    const currentUser = await catalystApp.userManagement().getCurrentUser().catch((er) => console.log('No user !!!'));

    if(!currentUser) {
        res.redirect('/__catalyst/auth/login');
        return;
    }

    res.locals.catalystApp = catalystApp;
    res.locals.user = currentUser;
    next();
});

app.post('/api/alien', async (req, res) => {
    try {
        const cityJson = req.body;
        const city = cityJson.city_name;

        if(!city) {
            throw new Error('City details empty');
        }

        const cityDetails = await alienCity.findFirst({ where: {
            cityname: {
                contains: city
            }
        }});

        if(cityDetails) {
            res.send({
                "message": "Looks like you are not the first person to encounter aliens in this city! Someone has already reported an alien encounter here!"
            });
            return;
        }

        const currentUser = res.locals.user as ICatalystUser;

        const addAlien = await alienCity.create({
            data: {
                cityname: city,
                createdtime: new Date(),
                creatorid: (currentUser && currentUser.user_id) || '1234567890'
            }
        });

        console.log('added alien: ', addAlien);

        res.send({
            message: `Thanks for reporting !!!`
        });
    } catch (er) {
        console.log('Error: ', er);
        sendErrorResponse(res);
    }
});
 
app.get('/api/alien', async (req, res) => {
    try {
        const city = req.query.city_name;
        if(!city) {
            throw new Error('City details empty');
        }

        const cityDetails = await alienCity.findFirst({
            where: {
                cityname: city as string
            }
        });

        if(!cityDetails) {
            res.send({
                "message": "Hurray! No alien encounters in this city yet!",
                "signal": "negative"
            });
            return;
        }
        res.send({
            "message": "Uh oh! Looks like there are aliens in this city!",
            "signal": "positive"
        });

    } catch (er) {
        console.log("Error: ", er);
        sendErrorResponse(res);
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        const user = res.locals.user;
        const allCities = await alienCity.findMany({
            where: {
                creatorid: user.user_id
            }
        });

        const transformed = allCities.map((city) => {

            const date = moment(city.createdtime).format('DD/MM/YYYY');
            return {
                id: city.entryid,
                date,
                city: city.cityname
            };
        });
        res.status(200).json(transformed);
    } catch(er) {
        console.log('Reports error: ', er);
        sendErrorResponse(res);
    }
});
 
 
// function getDataFromCatalystDataStore(catalystApp, cityName) {
//     return new Promise((resolve, reject) => {
//         // Queries the Catalyst Data Store table
//         catalystApp.zcql().executeZCQLQuery("Select * from " + tableName + " where " + columnName + "='" + cityName + "'").then(queryResponse => {
//             resolve(queryResponse);
//         }).catch(err => {
//             reject(err);
//         })
//     });
 
// }
 
function sendErrorResponse(res: express.Response) {
    res.status(500);
    res.send({
        "error": "Internal server error occurred. Please try again in some time."
    });
}

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

app.listen(port, () => {
    console.log('Application listening on port: ', port);
});
