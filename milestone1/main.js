/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description: 
 * 
 * Created Date: 
 * Author:
 * 
 */

import * as IOhandler from "./IOhandler.js";
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const
    zipFilePath = `${__dirname}/myfile.zip`,
    pathUnzipped = `${__dirname}/unzipped`,
    pathProcessed = `${__dirname}/grayscaled`;

IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(() => {
        console.log("Zip file extracted successfully under '" + pathUnzipped + "'.");
        return IOhandler.grayScale(pathUnzipped, pathProcessed);
    })
    .catch(err => console.log(err.toString()));