import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processImages(inputDir: string, outputDir: string, scale: number) {
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const files = fs.readdirSync(inputDir);

        for (const file of files) {
            const filePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file);

            if (fs.lstatSync(filePath).isFile()) {
                const image = sharp(filePath);
                const metadata = await image.metadata();
                const width = Math.round(metadata.width! * scale);
                const height = Math.round(metadata.height! * scale);

                await image.resize(width, height, {kernel: sharp.kernel.nearest}).toFile(outputFilePath);

                console.log(`Processed ${file}`);
            }
        }
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
    console.error('Please provide input directory, output directory, and scale factor as arguments.');
    process.exit(1);
}

const inputDirectory = args[0];
const outputDirectory = args[1];
const scaleFactor = parseFloat(args[2]);

// // Example usage
// const inputDirectory = './raw-assets/textures'; // Replace with your input folder path
// const outputDirectory = './assets/textures'; // Replace with your output folder path
// const scaleFactor = 16; // Replace with your desired scale factor (e.g., 2 for upscaling by 2x)

processImages(inputDirectory, outputDirectory, scaleFactor);
