import axios from 'axios';
import reduce from 'async/reduce';

const safetyRatingsTemplate = ({modelYear, manufacturer, model}) => `https://one.nhtsa.gov/webapi/api/SafetyRatings/modelyear/${modelYear}/make/${manufacturer}/model/${model}?format=json`
const safetyRatingByVehicleId = (VehicleId) => `https://one.nhtsa.gov/webapi/api/SafetyRatings/VehicleId/${VehicleId}?format=json`

const getSafetyRatings = ({modelYear, manufacturer, model}, cb) => {
  const urlTemplate = safetyRatingsTemplate({modelYear, manufacturer, model});

  axios.get(urlTemplate)
    .then(({data}) => {
      return cb(null, {
        Count: data.Count,
        Results: data.Results.map(it => {
          return {
            Description: it.VehicleDescription,
            VehicleId: it.VehicleId
          }
        })

      })
    })
    .catch(() => {
      return cb(null, {  Count: '0', Results:[]})
    });
}

const getSafetyRatingsWithCrashRating = ({modelYear, manufacturer, model}, cb) => {
  getSafetyRatings({modelYear, manufacturer, model}, (err, result) => {
    var vehicleIds = result.Results.map((it) => it.VehicleId);

    reduce(
      vehicleIds,
      {},
      (memo, item, cb) =>{
        const urlTemplate = safetyRatingByVehicleId(item)
        
        axios.get(urlTemplate)
          .then(({ data }) => {
            if (data.Count == 0) {
              return cb(null,  Object.assign({}, memo, {[item]:''}))            
            }
            return cb(
               null, 
               Object.assign({}, memo, {[item]: data.Results[0].OverallRating})
            )
          })
          .catch(() => {
            return cb(null,item)
          });
      },
      (err, data) => {
        cb(null, {
          Count: result.Count,
          Results:  result.Results.map(it => Object.assign({}, it, { crashRating: data[it.VehicleId.toString()] }))
        })
      })
  })
}


export default {
  getSafetyRatings: getSafetyRatings,
  getSafetyRatingsWithCrashRating: getSafetyRatingsWithCrashRating
}