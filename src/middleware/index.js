import { Router } from 'express';
import safetyRatingsService from '../services/safety-ratings';

export default () => {
	let routes = Router();

  routes.get('/vehicles/:modelYear/:manufacturer/:model', (req, res) => {
    if (req.query.withRating == 'true'){
      return safetyRatingsService.getSafetyRatingsWithCrashRating(req.params, (err, result) => res.json(result))
    }  
    safetyRatingsService.getSafetyRatings(req.params, (err, result) => res.json(result))

  });

  routes.post('/vehicles', (req, res) => {
    const {modelYear, manufacturer, model} = req.body;
    safetyRatingsService.getSafetyRatings({modelYear, manufacturer, model}, (err, result) => res.json(result))
  });
  //http://localhost:8888/vehicles/<MODEL YEAR>/<MANUFACTURER>/<MODEL>
	return routes;
}
