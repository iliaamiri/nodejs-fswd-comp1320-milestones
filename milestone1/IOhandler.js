/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import {readChunk} from "read-chunk";
import isPng from 'is-png';
import {PNG} from 'pngjs';

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(pathIn)
            .pipe(unzipper.Extract({path: pathOut}))
            .on('data', () => {
            })
            .on('finish', () => {
                resolve();
            })
            .on('error', err => reject(err));
    })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @return {promise}
 * @param dir
 */
const readDir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        })
    });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @return {promise}
 * @param {string} pathIn
 * @param {string} pathOut
 */
const grayScale = (pathIn, pathOut) => {
    return new Promise((resolve, reject) => {
        readDir(pathIn)
            .then(async (files) => {
                for (let fileItem of files) {
                    let filePath = path.join(pathIn, fileItem);
                    await readChunk(filePath, {length: 8})
                        .then((buffer) => {
                            if (!isPng(buffer)) {
                                return reject("The file '" + fileItem.toString() + "' is not a valid PNG file!");
                            }

                            fs.createReadStream(filePath)
                                .pipe(
                                    new PNG({
                                        filterType: 4
                                    })
                                )
                                .on('parsed', function() {
                                    for (let y = 0; y < this.height; y++) {
                                        for (let x = 0; x < this.width; x++) {
                                            let idx = (this.width * y + x) << 2;

                                            // convert to black and white
                                            let gray = rgb2grayscale(this.data[idx], this.data[idx + 1], this.data[idx + 2]);

                                            this.data[idx] = gray;
                                            this.data[idx + 1] = gray;
                                            this.data[idx + 2] = gray;
                                        }
                                    }

                                    this.pack().pipe(fs.createWriteStream(path.join(pathOut, fileItem)));
                                })
                                .on('end', () => {
                                    console.log("File " + fileItem + " Conversion to Black and White was successful.");
                                });
                        })
                        .catch(err => {
                            if (typeof err[0] !== 'undefined' && err[0].hasOwnProperty('code') && err[0].code === "EISDIR") {
                                reject("Please only insert files and not folders")
                            } else {
                                reject(err);
                            }
                        });
                }
            })
            .catch(err => reject(err));
    });
};

const rgb2grayscale = (r, g, b) => (r + g + b) / 3;

export {
    unzip,
    readDir,
    grayScale
};