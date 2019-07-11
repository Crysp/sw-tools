const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const exists = require('fs').existsSync;
const inquirer = require('inquirer');

const cwd = process.cwd();
const boilerplateDir = path.join(__dirname, '../boilerplate');

function getPath() {
    if (exists(path.join(cwd, './package.json'))) {
        return 'root';
    }
    if (exists(path.join(cwd, './components'))) {
        return 'src';
    }
    return '';
}

function setTargetPath(callback, type) {

    function q() {
        const questions = [{
            type: 'input',
            name: 'target',
            message: 'which path do you want to create template to ? (default is current directory ./): ',
        }];

        inquirer.prompt(questions).then(function (answers) {
            if (callback) {
                callback(path.join(cwd, answers.target || './'));
            }
        });
    }

    const currentPath = getPath();

    if (currentPath === 'root' && type) {

        try {
            switch (type) {
                case 'component':
                    callback(path.join(cwd, './src/components/'));
                    break;
                default:
                    break;
            }
        } catch (e) {
            q();
        }

    } else if (currentPath === 'src' && type) {

        try {
            switch (type) {
                case 'page':
                    callback(path.join(cwd, './routes/'));
                    break;
                case 'component':
                    callback(path.join(cwd, './components/'));
                    break;
                case 'model':
                    callback(path.join(cwd, './models/'));
                    break;
                case 'service':
                    callback(path.join(cwd, './services/'));
                    break;
                default:
                    break;
            }
        } catch (e) {
            q();
        }

    } else {
        q();
    }
}

function langExt(lang) {
    switch (lang) {
        case 'javascript':
            return isReact => isReact ? 'jsx' : 'js';
        case 'typescript':
            return isReact => isReact ? 'tsx' : 'ts';
        default:
            return () => {};
    }
}

function normal() {
    const questions = [{
        type: 'list',
        name: 'type',
        message: 'what do you want to generate ?',
        choices: [
            'component',
        ],
    }];

    inquirer.prompt(questions).then(function (answers) {
        switch (answers.type) {
            case 'component':
                component();
                break;
            default:
                break;
        }
    });
}

function component() {
    const questions = [{
        type: 'list',
        name: 'lang',
        message: 'which kind of language do you want to use ?',
        choices: [
            'javascript',
            'typescript',
        ],
    }];

    inquirer.prompt(questions).then(function ({ lang }) {
        const ext = langExt(lang);

        const q = [{
            type: 'input',
            name: 'name',
            message: 'component name: ',
        }];

        inquirer.prompt(q).then(function ({ name }) {
            const codeAdapter = code => code.replace(/ComponentName/g, name);

            setTargetPath(function (target) {

                const cPath = path.join(target, `./${name}`);
                const tPath = path.join(cPath, `./__tests__`);
                const basePath = path.join(boilerplateDir, `./component/${lang}`);

                fs.ensureDirSync(target);
                fs.ensureDirSync(tPath);

                const componentCode = fs.readFileSync(`${basePath}/index.${ext(true)}`, 'utf8');
                fs.writeFileSync(`${cPath}/index.${ext(true)}`, codeAdapter(componentCode));
                fs.copySync(`${basePath}/styled.${ext(false)}`, `${cPath}/styled.${ext(false)}`, { overwrite: true });

                const behaviorTestCode = fs.readFileSync(`${basePath}/__tests__/behavior.${ext(true)}`, 'utf8');
                fs.writeFileSync(`${tPath}/behavior.${ext(true)}`, codeAdapter(behaviorTestCode));

                const renderTestCode = fs.readFileSync(`${basePath}/__tests__/render.${ext(true)}`, 'utf8');
                fs.writeFileSync(`${tPath}/render.${ext(true)}`, codeAdapter(renderTestCode));

                console.log(chalk.green(`generated component ${name} success：${cPath}`));
            }, 'component');
        });
    });
}

module.exports = function (args) {
    const name = args[3];
    if (!name) {
        normal();
        return;
    }

    switch (name) {
        case 'component':
            component();
            break;
        default:
            console.log(chalk.red('none of this type'));
            normal();
            break;
    }

};
