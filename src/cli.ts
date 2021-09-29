#!/usr/bin/env node

import { prompt } from 'inquirer'
import { join } from 'path'
import { copyFile, readFile, writeFile, readdir } from 'fs/promises'
import { compile } from 'handlebars'
import { green, red } from 'ansi-colors'

/**
 * 复制文件到目录信息
 * 
 * @param project  用户输入的项目名称, 也就是生成的文件夹信息
 * @param fileName 要复制的文件信息
 */
async function copyPresetFile(fileName: string) {

    const file = fileName.substr(0, fileName.length - 7)
    copyFile(
        join(__dirname, '..', 'preset', fileName),
        join(process.cwd(), file)
    ).then(() => {
        console.log(green(`+ ${file}`))
    })
}

type PackageCfg = {
    name: string 
    author: string
    version: string
    license: string
}

async function writeFilePackage ({
    name,
    author,
    version,
    license
}: PackageCfg) {
    const txt = await readFile(join(__dirname, '..', 'preset', 'package.json.preset'), 'utf8')
    const template = compile(txt)
    const content = template({
        name,
        author,
        version,
        license
    })
    await writeFile(join(process.cwd(), 'package.json'), content)
    console.log(green(`+ package.json`))
}

async function main () {
    const files = await readdir(process.cwd())
    if (files.length > 0) throw red('must be a non-empty directory.')

    const result = await prompt([{
        type: 'input',
        name: 'name',
        message: "Please enter the project name:",
    }, {
        type: 'input',
        name: 'author',
        message: "Please enter the author information:",
    }, {
        type: 'input',
        name: 'license',
        message: "Please enter the open source license default (MIT):",
    },{
        type: 'input',
        name: 'version',
        message: "Please enter the version number default (0.0.1-canary):",
    }])

    const { name, author, version,  license }: PackageCfg = result
    
    /** 异步复制文件到创建的文件夹中 */
    copyPresetFile('.eslintrc.js.preset')
    copyPresetFile('.gitignore.preset')
    copyPresetFile('.prettierrc.json.preset')
    copyPresetFile('babel.config.js.preset')
    copyPresetFile('jest.config.ts.preset')
    copyPresetFile('tsconfig.json.preset')
    writeFilePackage({
        name,
        author,
        version: version || '0.0.1-canary',
        license: license || 'MIT'
    })
}

main().catch((e) => {
    console.log(e)
})