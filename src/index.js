import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import middleware from './middleware';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));


app.use(middleware({ config }));

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
