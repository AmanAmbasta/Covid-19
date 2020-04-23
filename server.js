const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const url_counts  = `https://api.rootnet.in/covid19-in/stats/latest`;
const url_test    = `https://api.rootnet.in/covid19-in/stats/testing/history`;
const url_beds    = `https://api.rootnet.in/covid19-in/hospitals/beds`;
const url_contact = `https://api.rootnet.in/covid19-in/contacts`;

const app = express();
const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(express.json({ limit: '20mb' }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {

    const url_counts_response  = await fetch(url_counts);
    const url_test_response    = await fetch(url_test);
    const url_beds_response    = await fetch(url_beds);
    const url_contact_response = await fetch(url_contact);

    let counts_data  = await url_counts_response.json();
    let test_data    = await url_test_response.json();
    let beds_data    = await url_beds_response.json();
    let contact_data = await url_contact_response.json();

    console.log(counts_data.success);
    console.log(test_data.success);
    console.log(beds_data.success);
    console.log(contact_data.success);

    const counts = {
        counts_data_total                 : counts_data.data.summary.total,
        counts_data_confirmedCasesIndian  : counts_data.data.summary.confirmedCasesIndian,
        counts_data_confirmedCasesForeign : counts_data.data.summary.confirmedCasesForeign,
        counts_data_discharged            : counts_data.data.summary.discharged,
        counts_data_deaths                : counts_data.data.summary.deaths
    };
    /* console.log(`Count data counts_data_total:${counts.counts_data_total},counts_data_confirmedCasesIndian:${counts.counts_data_confirmedCasesIndian},
    counts_data_confirmedCasesForeign :${counts.counts_data_confirmedCasesForeign},counts_data_discharged:${counts.counts_data_discharged},counts_data_deaths:${counts.counts_data_deaths},`);
     */
    const lengDataTesting = test_data.data.length - 1;
    
    
    const test = {
        test_data_day                    : test_data.data[lengDataTesting].day || 'Not Available',
        test_data_totalSamplesTested     : test_data.data[lengDataTesting].totalSamplesTested || 'Not Available',
        test_data_totalIndividualsTested : test_data.data[lengDataTesting].totalIndividualsTested || 'Not Available',
        test_data_totalPositiveCases     : test_data.data[lengDataTesting].totalPositiveCases || 'Not Available',
        test_data_source                 : test_data.data[lengDataTesting].source || 'Not Available'
    };

    const beds = {
        beds_data_ruralHospitals : beds_data.data.summary.ruralHospitals,
        beds_data_ruralBeds      : beds_data.data.summary.ruralBeds,
        beds_data_urbanHospitals : beds_data.data.summary.urbanHospitals,
        beds_data_urbanBeds      : beds_data.data.summary.urbanBeds,
        beds_data_totalHospitals : beds_data.data.summary.totalHospitals,
        beds_data_totalBeds      : beds_data.data.summary.totalBeds,
    };
    const contact = {
        contact_data_number          : contact_data.data.contacts.primary.number,
       // contact_data_number_tollfree : contact_data.data.contacts.primary.'number-tollfree' ,
        contact_data_email           : contact_data.data.contacts.primary.email,
        contact_data_twitter         : contact_data.data.contacts.primary.twitter,
        contact_data_facebook        : contact_data.data.contacts.primary.facebook
    };

    const data ={
        contact : contact,
        beds    : beds,
        test    : test,
        counts  : counts,
        message : "done"
    };

    res.render('index',{data : data});
   
});