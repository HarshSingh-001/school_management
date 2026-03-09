import db from "../config/db.js";

// Add School
const addSchool = (req, res) => {

  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const query = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, address, latitude, longitude], (err, result) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.status(201).json({
      message: "School added successfully",
      id: result.insertId
    });

  });

};





// Haversine Distance Formula
function calculateDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}



// List Schools
const listSchools = (req, res) => {

  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Latitude and longitude required"
    });
  }
 
  const query = "SELECT * FROM schools";

  db.query(query, (err, schools) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schoolsWithDistance = schools.map((school) => {

      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return { ...school, distance };

    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);

  });

};

export {addSchool, listSchools}