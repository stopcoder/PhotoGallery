const fs = require("fs");
const walk = require("walk");
const path = process.argv[2] || "/mnt/photo1/";
const pt = require("path");
const sharp = require("sharp");

const exec = require('child_process').exec;

const walker = walk.walk(path);

walker.on("file", function(root, fileStats, next) {
    let ext = fileStats.name.substr(fileStats.name.length - 3, 3).toLowerCase();
    if (ext === "cr2" || ext === "dng") {
        let filePath = pt.join(root, fileStats.name);
        let outputdir = pt.join(root, "jpg");
        let ufrawFilePath = pt.join(outputdir, fileStats.name.substr(0, fileStats.name.length - 3) + "jpg");
        let outputFilePath = pt.join(outputdir, fileStats.name.substr(0, fileStats.name.length - 4) + "_s.jpg");
        if (!fs.existsSync(outputdir)) {
            fs.mkdirSync(outputdir);
        }
        if (!fs.existsSync(outputFilePath)) {
            exec(`ufraw-batch --exposure=auto --wb=camera --out-type=jpg --compression=60 --out-path=${outputdir} ${filePath}`, function(error, stdout, stderr) {
                let p;
                if (error) {
                    console.log(error);
                    p = Promise.resolve();
                } else {
                    let jpg = sharp(ufrawFilePath);

                    p = jpg.metadata().then(function(metadata) {
                        let bWidthBigger = metadata.width > metadata.height;
                        return jpg.resize(bWidthBigger ? 1800 : undefined, bWidthBigger ? undefined : 1800)
                                .toFile(outputFilePath)
                                .then(function() {
                                    console.log("converted and saved to " + outputFilePath);
                                    fs.unlinkSync(ufrawFilePath);
                                });
                    });
                }

                p.then(function() {
                    next();
                });
            });
        } else {
            next();
        }
    } else {
        next();
    }
});
