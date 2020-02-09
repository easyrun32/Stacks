var path = require("path");
const { Storage } = require("@google-cloud/storage");
const googlestorage = new Storage({
  keyFilename: path.join(__dirname, "/secret.json"),
  projectId: "apiman"
});

const uploadpicture = async (bucketName, user, filename) => {
  let bool = false; // bool is loading
  await googlestorage.bucket(bucketName).upload(filename, {
    gzip: true, // during http zips the file but doesnt acually zip when the process is over
    destination: user, // creates a folder user3/ with the asociated file user3/{whatever}
    metadata: {
      // not too sure what this does
      cacheControl: "public, max-age=31536000"
    }
  });
  await googlestorage
    .bucket(bucketName)
    .file(user)
    .makePublic();
  console.log(
    `${filename} file has been uploaded to google cloud storage bucketname: ${bucketName}.`
  );
  bool = true; //once it's finished loading
  return bool;
};

const deletepicture = async (bucketName, filename) => {
  await googlestorage
    .bucket(bucketName)
    .file(filename)
    .delete();
  console.log(
    `${filename} file has been deleted of  ${bucketName}.  from google cloud storage`
  );
};
module.exports = { uploadpicture, deletepicture };
