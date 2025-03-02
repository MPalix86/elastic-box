const fs = require('fs');
const { exec, execSync } = require('child_process');
const path = require('path');
const util = require('util');

// Promisify exec per usarlo con async/await
const execPromise = util.promisify(exec);

async function runCommand() {
  try {
    // Esegui npm pack
    console.log('Creating package...');
    const { stdout: packOutput } = await execPromise('npm pack');
    console.log(packOutput);

    // Estrai il nome esatto del pacchetto dall'output di npm pack
    const packageFileName = packOutput.trim();
    console.log(`Package created: ${packageFileName}`);


    // Copia il file nella directory test-app
    console.log('Copying package to test-app directory...');
    fs.copyFileSync(packageFileName, `./test-app/${packageFileName}`);
    console.log(`Package copied to ./test-app/${packageFileName}`)

    fs.unlinkSync(`./${packageFileName}`)

    // Rimuovi e installa il pacchetto
    console.log('Installing package in test-app...');
    try {
      await execPromise('npm uninstall MPalix86-elastic-box', { cwd: './test-app' });
    } catch (error) {
      console.log('Package was not previously installed or uninstall failed, continuing...');
    }

    // Installa il pacchetto DALLA DIRECTORY test-app
    await execPromise(`npm install ./${packageFileName}`, { cwd: './test-app' });
    console.log('Package installed successfully!');

    // Avvia Vite
    console.log('Starting Vite...');
    const { spawn } = require('child_process');
    const vite = spawn('npx', ['vite'], {
      cwd: './test-app',
      stdio: 'inherit',
      shell: true,
    });

    vite.on('error', error => {
      console.error(`Error starting Vite: ${error.message}`);
    });
  } catch (error) {
    console.error('Error:', error);
    console.error(error.stdout || '');
    console.error(error.stderr || '');
  }
}

runCommand();
