const Configurator = require("./Configurator");
const fs = require('fs');
const fs2 = require('fs-extra');

const readLine = require("readline");
const consoletitle = require('console-title');
const rl = readLine.createInterface(
    process.stdin,
    process.stdout
)
const path = require('path');
const { exit } = require("process");

function log(message) {
    const cli = require('cli-color');
    console.log(cli.greenBright(`INFO:`) + ` ${message}`);
}

const argsx = process.argv;
const commandList = [
    {
        name: "--help",
        args: [],
        description: "Shows help menu",
        isInHelpMenu: true
    },
    {
        name: "--init",
        args: [],
        description: "Creates a new nodePackages.nodejson file",
        isInHelpMenu: true,
    },
    {
        name: "--install",
        args: [
            {
                description: "packageName",
                isNeeded: true
            }
        ],
        description: "installs a package",
        isInHelpMenu: true
    }
]

function containsArg(index, arg) {
    if (argsx[index] == arg) {
        return true;
    } else {
        return false;
    }
}

function containsArgIgnoreCase(index, arg) {
    if (argsx[index].toUpperCase() == arg.toUpperCase()) {
        return true;
    } else {
        return false;
    }
}

function getArg(index) {
    if (containsArg(index, argsx[index])) {
        return argsx[index];
    } else {
        return null;
    }
}

function getArgIgnoreCase(index) {
    if (containsArgIgnoreCase(index, args[index])) {
        return getArg(index);
    } else {
        return false;
    }
}

log("Creating config...")
let fileConfig = new Configurator("C:\\Program Files\\NodeExtension\\config\\config.json").load();

function copyFilesFromPackage() {
    log("Copying files... Package Name: " + getArg(3).toLowerCase())
    if (fs.existsSync("nodePackages/" + getArg(3).toLowerCase())) {
        log("Copying data from Package....")
        fs2.copySync("C:\\Program Files\\NodeExtension\\packages/" + getArg(3).toLowerCase(), "nodePackages/" + getArg(3).toLowerCase());
        return;
    }
    fs.mkdirSync("nodePackages/" + getArg(3).toLowerCase());
    log("Copying data from Package....")
    fs2.copySync("C:\\Program Files\\NodeExtension\\packages/" + getArg(3).toLowerCase(), "nodePackages/" + getArg(3).toLowerCase());
}

const cwd = process.cwd()

function run() {
    if (containsArg(2, "--help") || !argsx.length > 2 || argsx.length == 2) {
        let strCommands = "";
        for (let command of commandList) {
            if (command.isInHelpMenu) {
                if (command.args.length) {
                    for (let arg of command.args) {
                        if (arg.isNeeded) {
                            strCommands += `${command.name} <${arg.description}> | ${command.description}\n`;
                            
                        } else {
                            strCommands += `${command.name} [${arg.description}] | ${command.description}\n`;
                            
                        }
                    }
                    
                } else {
                    strCommands += `${command.name} | ${command.description}\n`;
                }
                
                
            }
        }
        strCommands += "\nEnd of List";
        console.log(`Command list\n\n${strCommands}`);
        exit(0);
    }

    if (containsArg(2, "--install")) {
        if (fs.existsSync(`${cwd}\\nodePackages`)) {
            copyFilesFromPackage();
        } else {
            fs.mkdirSync(`${cwd}\\nodePackages`);
            copyFilesFromPackage();
        }

        if (fs.existsSync("nodePackages.nodejson")) {

            const packageFile = new Configurator(`${cwd}\\nodePackages.nodejson`).load();
            if (!packageFile.has("packages")) {
                packageFile.set("packages", {});
                packageFile.save();
            }
            const pkg = new Configurator("C:\\Program Files\\NodeExtension\\packages\\" + getArg(3) + "\\nodePackages.nodejson").load();
            
            const pkgName = pkg.get("name");

            const pkgVersion = pkg.get("version");

            packageFile.getDictionary("packages").set(pkgName, pkgVersion);
            packageFile.save();
            process.exit(0);
        }

        const packageFile = new Configurator(`${cwd}\\nodePackages.nodejson`).createNew();
        if (!packageFile.has("packages")) {
            packageFile.set("packages", {});
            packageFile.save();
        }
        const pkg = new Configurator("C:\\Program Files\\NodeExtension\\packages\\" + getArg(3).toLowerCase() + "\\nodePackages.nodejson").load();
        
        const pkgName = pkg.get("name");

        const pkgVersion = pkg.get("version");

        if (pkg.has("packages")) {
            packageFile.getDictionary("packages").set(`${pkgName}`, {
                name: `${pkgName}`,
                version: `${pkgVersion}`,
                packages: pkg.get("packages"),
            });
            packageFile.save();
            process.exit(0);
        }

        packageFile.getDictionary("packages").set(`${pkgName}`, `^${pkgVersion}`);
        packageFile.save();
        log("Package installing done!")
        process.exit(0);
    }
    if (containsArg(2, "--init")) {
        fs.writeFileSync("NDOE_EXTENSION_STATIC.NODEIPL", "STATIC=TRUE")
        log("Loading Init Options");
        setTimeout(() => {
            let packageName = "";
            let packageVersion = "";
            let pkgDescription = "";
            let pkgMainFile = "";
            let author = "";
            let license = "";
            rl.question(`What's your package name? (${path.basename(cwd)}) `, (answer) => {
                if (answer === "") {
                    packageName = `${path.basename(cwd)}`;
                    
                } else {
                    packageName = answer.replace(" ", "-").toLowerCase();
                   
                }
                rl.question(`What's the version of your package? (1.0.0) `, (answer1) => {
                    if (answer1 === "") {
                        packageVersion = "1.0.0";
                        
                    } else {
                        packageVersion = answer1;
                        
                    }
                    rl.question(`What's the description of your package? (Nothing as default) `, (answer2) => {
                        if (answer2 === "") {
                            pkgDescription = "";
                        } else {
                            pkgDescription = answer2;
                        }
                        rl.question(`What's the main file? (index.js) `, (answer3) => {
                            if (answer3 === "" || !answer3.endsWith(".js")) {
                                pkgMainFile = "index.js";
                            } else if (answer3 !== "" && answer3.endsWith(".js")) {
                                pkgMainFile = answer3;
                            }
                            
                            rl.question("What's the author of this package? (Nothing as default) ", (answer4) => {
                                if (answer4 === "") {
                                    author = "";
                                } else {
                                    author = answer4;
                                }
    
                                rl.question("What's the license of this package? (MIT)", (answer6) => {
                                    if (answer6 === "") {
                                        license = "MIT"
                                    } else {
                                        license = answer6
                                    }

                                    rl.close();
    
    
                                    console.log("Creating nodePackages.nodejson File!");
                                
                                    if (fs.existsSync(`${cwd}/nodePackages.nodejson`)) {
                                        let packagesFile = new Configurator(`${cwd}/nodePackages.nodejson`).load();
        
                                        packagesFile.set("name", packageName);
                                        packagesFile.set("version", packageVersion);
                                        packagesFile.set("description", pkgDescription);
                                        packagesFile.set("main", pkgMainFile);
                                        packagesFile.set("license", license);
                                        packagesFile.set("author", author);
                                        packagesFile.save();
                                        process.exit(0);
                                    }
        
                                    let packagesFile = new Configurator(`${cwd}/nodePackages.nodejson`).createNew();
        
                                    packagesFile.set("name", packageName);
                                    packagesFile.set("version", packageVersion);
                                    packagesFile.set("description", pkgDescription);
                                    packagesFile.set("main", pkgMainFile);
                                    packagesFile.set("license", license);
                                    packagesFile.set("author", author);
                                    packagesFile.save();
                                    process.exit(0);
                                })
                            });
                        });
                    });
                });
            });
        }, 1000);
    }
}

run()