"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMochawesome = exports.runLastFailedCypressTest = exports.runCypressTests = exports.runCypressTestsInParallel = exports.downloadLastFailed = exports.uploadLastFailed = exports.uploadCypressVideo = exports.getVideoPath = exports.runOneCypressSpec = exports.runWithRecording = exports.mochawesome = void 0;
// @ts-ignore
var app_root_path_1 = require("app-root-path");
var cypress = require("cypress");
var slack_alert_js_1 = require("cypress-slack-reporter/bin/slack/slack-alert.js");
var fs = require("fs");
var Q = require("q");
// @ts-ignore
var rimraf_1 = require("rimraf");
var fileHelper = require("../ts/qm.file-helper");
// require untyped library file
// tslint:disable-next-line:no-var-requires
var qm = require("../src/js/qmHelpers.js");
var qmGit = require("../ts/qm.git");
var qmLog = require("../ts/qm.log");
var test_helpers_1 = require("../ts/test-helpers");
// https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
// loadEnv(".env.local")
var ciProvider = test_helpers_1.getCiProvider();
var isWin = process.platform === "win32";
var outputReportDir = app_root_path_1 + "/cypress/reports/mocha";
var screenshotDirectory = outputReportDir + "/assets";
var unmerged = app_root_path_1 + "/cypress/reports/mocha";
var vcsProvider = "github";
var verbose = true;
var videoDirectory = app_root_path_1 + "/cypress/videos";
var mergedJsonPath = outputReportDir + "/mochawesome.json";
var lastFailedCypressTestPath = "last-failed-cypress-test";
var releaseStage = process.env.RELEASE_STAGE || "production";
var s3Bucket = "qmimages";
var paths = {
    reports: {
        junit: "./cypress/reports/junit",
        mocha: "./cypress/reports/mocha",
    },
};
function getReportUrl() {
    var url = process.env.JOB_URL;
    if (url && url.indexOf("DEPLOY-") === 0) {
        return url + "ws/tmp/quantimodo-sdk-javascript/mochawesome-report/mochawesome.html";
    }
    return test_helpers_1.getBuildLink();
}
function mochawesome(failedTests, cb) {
    var abs = fileHelper.getAbsolutePath(unmerged);
    console.log("Merging reports in " + abs);
    mochawesome_merge_1.merge({
        inline: true,
        reportDir: abs,
        saveJson: true,
    }).then(function (mergedJson) {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2));
        // console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir)
        return mochawesome_report_generator_1.create(mergedJson, {
            // cdn: true,
            autoOpen: isWin,
            charts: true,
            inline: true,
            overwrite: true,
            reportDir: outputReportDir,
            saveJson: true,
            showPassed: true,
        });
    }).then(function (generatedReport) {
        console.log("Merged report available here:-", generatedReport[0]);
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider: ciProvider,
            outputReportDir: outputReportDir,
            screenshotDirectory: screenshotDirectory,
            vcsProvider: vcsProvider,
            verbose: verbose,
            videoDirectory: videoDirectory,
        });
        try {
            // @ts-ignore
            // noinspection JSUnusedLocalSymbols
            if (!process.env.SLACK_WEBHOOK_URL) {
                console.error("env SLACK_WEBHOOK_URL not set!");
            }
            else {
                // @ts-ignore
                slack_alert_js_1.slackRunner(ciProvider, vcsProvider, outputReportDir, videoDirectory, screenshotDirectory, verbose);
                // tslint:disable-next-line: no-console
                // console.log("Finished slack upload")
            }
        }
        catch (error) {
            console.error(error);
        }
        cb(generatedReport[0]);
    });
}
exports.mochawesome = mochawesome;
function setGithubStatusAndUploadTestResults(failedTests, context, cb) {
    var test = failedTests[0];
    var failedTestTitle = failedTests[0].title[1];
    var errorMessage = test.displayError;
    if (!failedTests[0].displayError || failedTests[0].displayError === "undefined") {
        qmLog.le("No displayError on failedTests[0]: ", failedTests[0]);
    }
    qmGit.setGithubStatus("failure", context, failedTestTitle + " err: " +
        failedTests[0].error, getReportUrl(), function () {
        uploadMochawesome().then(function (urls) {
            console.error(errorMessage);
            cb(errorMessage);
            // resolve();
        });
    });
}
function deleteJUnitTestResults() {
    var jUnitFiles = paths.reports.junit + "/*.xml";
    rimraf_1(jUnitFiles, function () {
        console.debug("Deleted " + jUnitFiles);
    });
}
function logFailedTests(failedTests, context, cb) {
    // tslint:disable-next-line:prefer-for-of
    for (var j = 0; j < failedTests.length; j++) {
        var test_1 = failedTests[j];
        var testName = test_1.title[1];
        var errorMessage = test_1.error || test_1.message || test_1.displayError;
        if (!errorMessage) {
            errorMessage = JSON.stringify(test_1);
            console.error("no test.error or test.message or test.displayError property in " + errorMessage);
        }
        console.error("==============================================");
        console.error(testName + " FAILED");
        console.error(errorMessage);
        console.error("==============================================");
    }
    test_helpers_1.deleteSuccessFile().then(function () {
        mochawesome(failedTests, function () {
            setGithubStatusAndUploadTestResults(failedTests, context, cb);
        });
    });
}
function runWithRecording(specName, cb) {
    var specsPath = getSpecsPath();
    var specPath = specsPath + "/" + specName;
    var browser = process.env.CYPRESS_BROWSER || "electron";
    var context = specName.replace("_spec.js", "") + "-" + releaseStage;
    console.info("Re-running " + specName + " with recording so you can check it at https://dashboard.cypress.io/");
    cypress.run({
        browser: browser,
        record: true,
        spec: specPath,
    }).then(function (recordingResults) {
        var runUrl = "No runUrl provided so just go to https://dashboard.cypress.io/";
        if ("runUrl" in recordingResults) {
            runUrl = recordingResults.runUrl;
        }
        uploadCypressVideo(specName)
            .then(function (s3Url) {
            var url = s3Url || test_helpers_1.getBuildLink() || runUrl;
            qmGit.setGithubStatus("error", context, "View recording of " + specName, url, function () {
                qmGit.createCommitComment(context, "\nView recording of " + specName + "\n" +
                    "[Cypress Dashboard](" + runUrl + ") or [Build Log](" + test_helpers_1.getBuildLink() + ") or [S3](" + s3Url + ")", function () {
                    cb(recordingResults);
                });
            });
        });
    });
}
exports.runWithRecording = runWithRecording;
function getFailedTestsFromResults(results) {
    if (!results.runs) {
        console.error("No runs on results obj: ", results);
    }
    var tests = results.runs[0].tests;
    var failedTests = [];
    if (tests) {
        failedTests = tests.filter(function (test) {
            return test.state === "failed";
        });
        if (!failedTests) {
            failedTests = [];
        }
    }
    else {
        console.error("No tests on ", results.runs[0]);
    }
    return failedTests;
}
function handleTestSuccess(results, context, cb) {
    deleteLastFailedCypressTest();
    console.info(results.totalPassed + " tests PASSED!");
    qmGit.setGithubStatus("success", context, results.totalPassed + " tests passed", null, function () {
        test_helpers_1.createSuccessFile()
            .then(function () {
            cb(false);
        });
    });
}
function runOneCypressSpec(specName, cb) {
    uploadLastFailed(specName); // Set last failed first so it exists if we have an exception
    var specsPath = getSpecsPath();
    var specPath = specsPath + "/" + specName;
    var browser = process.env.CYPRESS_BROWSER || "electron";
    var context = specName.replace("_spec.js", "") + "-" + releaseStage;
    qmGit.setGithubStatus("pending", context, "Running " + context + " Cypress tests...");
    // noinspection JSUnresolvedFunction
    cypress.run({
        browser: browser,
        record: true,
        spec: "cypress/integration/" + specName,
    }).then(function (results) {
        // @ts-ignore
        if (!results.runs || !results.runs[0]) {
            console.log("No runs property on " + JSON.stringify(results, null, 2));
            cb(false);
        }
        else {
            var failedTests = getFailedTestsFromResults(results);
            if (failedTests.length) {
                process.env.LOGROCKET = "1";
                fileHelper.uploadToS3InSubFolderWithCurrentDateTime(getVideoPath(specName), "cypress")
                    .then(function (url) {
                    runWithRecording(specName, function (recordResults) {
                        var failedRecordedTests = getFailedTestsFromResults(recordResults);
                        if (failedRecordedTests.length) {
                            logFailedTests(failedRecordedTests, context, function (errorMessage) {
                                cb(errorMessage);
                                process.exit(1);
                            });
                        }
                        else {
                            delete process.env.LOGROCKET;
                            handleTestSuccess(results, context, cb);
                        }
                    });
                });
            }
            else {
                handleTestSuccess(results, context, cb);
            }
        }
    }).catch(function (runtimeError) {
        qmGit.setGithubStatus("error", context, runtimeError, getReportUrl(), function () {
            console.error(runtimeError);
            process.exit(1);
        });
        qmLog.logEndOfProcess(specPath);
    });
}
exports.runOneCypressSpec = runOneCypressSpec;
function getVideoPath(specName) {
    return "cypress/videos/" + specName + ".mp4";
}
exports.getVideoPath = getVideoPath;
function uploadCypressVideo(specName) {
    return fileHelper.uploadToS3InSubFolderWithCurrentDateTime(getVideoPath(specName), "cypress");
}
exports.uploadCypressVideo = uploadCypressVideo;
function uploadLastFailed(specName, cb) {
    fs.writeFileSync(lastFailedCypressTestPath, specName);
    return fileHelper.uploadToS3(lastFailedCypressTestPath, "cypress/" + lastFailedCypressTestPath, "qmimages");
}
exports.uploadLastFailed = uploadLastFailed;
function downloadLastFailed() {
    return fileHelper.downloadFromS3(lastFailedCypressTestPath, "cypress" + "/" + lastFailedCypressTestPath, s3Bucket);
}
exports.downloadLastFailed = downloadLastFailed;
function getSpecsPath() {
    return app_root_path_1 + "/cypress/integration";
}
function runCypressTestsInParallel(cb) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    qmLog.logStartOfProcess("runCypressTestsInParallel");
                    return [4 /*yield*/, test_helpers_1.deleteSuccessFile()];
                case 1:
                    _a.sent();
                    deleteJUnitTestResults();
                    rimraf_1(paths.reports.mocha + "/*.json", function () {
                        var specsPath = getSpecsPath();
                        fs.readdir(specsPath, function (err, specFileNames) {
                            if (!specFileNames) {
                                throw new Error("No specFileNames in " + specsPath);
                            }
                            var promises = [];
                            var _loop_1 = function (specName) {
                                if (releaseStage === "ionic" && specName.indexOf("ionic_") === -1) {
                                    console.debug("skipping " + specName + " because it doesn't test ionic app and release stage is " +
                                        releaseStage);
                                    return "continue";
                                }
                                promises.push(new Promise(function (resolve) {
                                    runOneCypressSpec(specName, function () {
                                        resolve();
                                    });
                                }));
                            };
                            for (var _i = 0, specFileNames_1 = specFileNames; _i < specFileNames_1.length; _i++) {
                                var specName = specFileNames_1[_i];
                                _loop_1(specName);
                            }
                            Promise.all(promises).then(function (values) {
                                console.log(values);
                                test_helpers_1.createSuccessFile()
                                    .then(function () {
                                    test_helpers_1.deleteEnvFile();
                                    if (cb) {
                                        cb(false);
                                    }
                                    qmLog.logEndOfProcess("runCypressTestsInParallel");
                                });
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.runCypressTestsInParallel = runCypressTestsInParallel;
function moveToFront(specFileNames, first) {
    specFileNames.sort(function (x, y) {
        return x == first ? -1 : y == first ? 1 : 0;
    });
}
function runCypressTests(cb) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    qmLog.logStartOfProcess("runCypressTests");
                    return [4 /*yield*/, test_helpers_1.deleteSuccessFile()];
                case 1:
                    _a.sent();
                    deleteJUnitTestResults();
                    rimraf_1(paths.reports.mocha + "/*.json", function () {
                        var specsPath = getSpecsPath();
                        fs.readdir(specsPath, function (err, specFileNames) {
                            if (!specFileNames) {
                                qmLog.logEndOfProcess("runCypressTests");
                                throw new Error("No specFileNames in " + specsPath);
                            }
                            moveToFront(specFileNames, "ionic_measurements_spec.js"); // Fails a lot
                            moveToFront(specFileNames, "ionic_variables_spec.js"); // Fails a lot
                            var _loop_2 = function (i, p) {
                                var specName = specFileNames[i];
                                if (releaseStage === "ionic" && specName.indexOf("ionic_") === -1) {
                                    console.debug("skipping " + specName + " because it doesn't test ionic app and release stage is " +
                                        releaseStage);
                                    return out_p_1 = p, "continue";
                                }
                                p = p.then(function (_) { return new Promise(function (resolve) {
                                    runOneCypressSpec(specName, function () {
                                        if (i === specFileNames.length - 1) {
                                            test_helpers_1.createSuccessFile()
                                                .then(function () {
                                                test_helpers_1.deleteEnvFile();
                                                if (cb) {
                                                    cb(false);
                                                }
                                                qmLog.logEndOfProcess("runCypressTests");
                                            });
                                        }
                                        resolve();
                                    });
                                }); });
                                out_p_1 = p;
                            };
                            var out_p_1;
                            for (var i = 0, p = Promise.resolve(); i < specFileNames.length; i++) {
                                _loop_2(i, p);
                                p = out_p_1;
                            }
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.runCypressTests = runCypressTests;
function getLastFailedCypressTest() {
    var deferred = Q.defer();
    try {
        downloadLastFailed()
            .then(function (absPath) {
            if (!absPath) {
                deferred.resolve(null);
                return;
            }
            try {
                // @ts-ignore
                var spec = fs.readFileSync(absPath, "utf8");
                deferred.resolve(spec);
            }
            catch (error) {
                deferred.resolve(null);
            }
        });
    }
    catch (error) {
        qmLog.error(error);
        deferred.resolve(null);
    }
    return deferred.promise;
}
function deleteLastFailedCypressTest() {
    // tslint:disable-next-line:no-empty
    try {
        fs.unlinkSync(lastFailedCypressTestPath);
    }
    catch (err) {
        console.debug("No last-failed-cypress-test file to delete");
    }
}
// tslint:disable-next-line:unified-signatures
function runLastFailedCypressTest(cb) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            qmLog.logStartOfProcess("runLastFailedCypressTest");
            getLastFailedCypressTest()
                .then(function (name) {
                if (!name) {
                    console.info("No previously failed test!");
                    cb(false);
                    return;
                }
                test_helpers_1.deleteSuccessFile();
                // @ts-ignore
                runOneCypressSpec(name, cb);
            });
            return [2 /*return*/];
        });
    });
}
exports.runLastFailedCypressTest = runLastFailedCypressTest;
function uploadMochawesome() {
    var s3Key = "mochawesome/" + qmGit.getCurrentGitCommitSha();
    return fileHelper.uploadFolderToS3(outputReportDir, s3Key, s3Bucket, "public-read");
}
exports.uploadMochawesome = uploadMochawesome;
