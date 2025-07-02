#!/usr/bin/env node

const { exec } = require('child_process');
const { Parser } = require('json2csv');
const pdfDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const reportDirName = 'eslint-reports';

async function main() {
  console.log('🚀 [main] Starting Universal ESLint report generation...');

  const targetPath = process.argv[2] || process.cwd();
  const resolvedTargetPath = path.resolve(targetPath);
  const reportDir = path.join(resolvedTargetPath, reportDirName);

  console.log(`🔍 [main] Analyzing path: ${resolvedTargetPath}`);

  try {
    if (fs.existsSync(reportDir)) {
      console.log(`🧹 [main] Cleaning old report directory...`);
      fs.rmSync(reportDir, { recursive: true, force: true });
    }
    fs.mkdirSync(reportDir, { recursive: true });
    console.log(`✅ [main] Report directory created at: ${reportDir}`);
  } catch (error) {
    console.error(
      `❌ [main] Failed to prepare report directory: ${reportDir}`,
      error
    );
    process.exit(1);
  }

  try {
    const results = await runEslintInProject(resolvedTargetPath);
    const issues = results.flatMap(result =>
      result.messages.map(msg => ({
        filePath: path.relative(resolvedTargetPath, result.filePath),
        line: msg.line || 0,
        column: msg.column || 0,
        ruleId: msg.ruleId || 'Fatal',
        severity: msg.severity === 2 ? 'Error' : 'Warning',
        message: msg.message,
      }))
    );

    if (issues.length === 0) {
      console.log(
        '🎉 [main] No linting issues found. Generating empty reports.'
      );
      await createCsvReport([], reportDir);
      await createPdfReport([], reportDir);
      return;
    }

    console.log(
      `📄 [main] Found ${issues.length} total issues. Generating reports...`
    );
    await createCsvReport(issues, reportDir);
    await createPdfReport(issues, reportDir);

    console.log(`\n✅ [main] Reports generated successfully in '${reportDir}'`);
    console.log(`   - CSV: ${path.join(reportDir, 'report.csv')}`);
    console.log(`   - PDF: ${path.join(reportDir, 'report.pdf')}`);
  } catch (error) {
    console.error(
      '\n❌ [main] An unexpected error occurred during the linting process:'
    );
    console.error(error);
    process.exit(1);
  }
}

function runEslintInProject(projectPath) {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const eslintExecutable = isWindows ? 'eslint.cmd' : 'eslint';
    const eslintPath = path.join(
      projectPath,
      'node_modules',
      '.bin',
      eslintExecutable
    );

    if (!fs.existsSync(eslintPath)) {
      const errorMessage = `Could not find a local ESLint installation in '${projectPath}'. Please run 'npm install eslint' in that project.`;
      return reject(new Error(errorMessage));
    }

    const command = `"${eslintPath}" --format json --ignore-pattern "eslint.config.js" .`;
    exec(
      command,
      { cwd: projectPath, maxBuffer: 1024 * 1024 * 5 },
      (error, stdout, stderr) => {
        if (stdout) {
          try {
            const results = JSON.parse(stdout);
            resolve(results.filter(r => r.messages.length > 0));
          } catch (e) {
            reject(
              `Failed to parse ESLint JSON output. Error: ${e.message}\nRaw Output:\n${stdout}`
            );
          }
        } else if (error && stderr) {
          reject(`ESLint command failed:\n${stderr}`);
        } else {
          resolve([]);
        }
      }
    );
  });
}

async function createCsvReport(issues, reportDir) {
  const csvPath = path.join(reportDir, 'report.csv');
  if (issues.length === 0) {
    fs.writeFileSync(csvPath, 'No linting issues found.');
    return;
  }
  try {
    const fields = [
      'severity',
      'filePath',
      'line',
      'column',
      'ruleId',
      'message',
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(issues);
    fs.writeFileSync(csvPath, csv);
  } catch (err) {
    console.error('❌ [createCsvReport] Failed to create CSV report:', err);
  }
}

async function createPdfReport(issues, reportDir) {
  const pdfPath = path.join(reportDir, 'report.pdf');
  const doc = new pdfDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  try {
    const logoPath = path.join(__dirname, '..', 'static', 'img', 'logo.png');
    const titleText = 'ESLint Issues Report';
    const logoHeight = 40;
    const logoWidth = 40;
    const spacing = 10;

    doc.fontSize(20).font('Helvetica-Bold');
    const titleWidth = doc.widthOfString(titleText);
    const headerBlockWidth = logoWidth + spacing + titleWidth;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left + (pageWidth - headerBlockWidth) / 2;
    const startY = doc.y;

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, startX, startY, {
        width: logoWidth,
        height: logoHeight,
      });
    }

    const textHeight = doc.heightOfString(titleText);
    const textY = startY + (logoHeight - textHeight) / 2;

    doc
      .fillColor('red')
      .font('Helvetica-Bold')
      .fontSize(20)
      .text(titleText, startX + logoWidth + spacing, textY);

    doc.y = startY + logoHeight;
    doc.moveDown(0.5);

    const dateText = `Generated on: ${new Date().toLocaleString()}`;
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('black')
      .text(dateText, { align: 'center' });
    doc.moveDown(2);

    if (issues.length === 0) {
      doc
        .fontSize(12)
        .font('Helvetica')
        .text('No linting issues found.', { align: 'center' });
    } else {
      const errors = issues.filter(issue => issue.severity === 'Error');
      const warnings = issues.filter(issue => issue.severity === 'Warning');

      const table = {
        headers: [
          '#',
          'Severity',
          'File Path',
          'Location',
          'Rule ID',
          'Message',
        ],
        columns: [
          { id: 'num', width: 30, align: 'center' },
          { id: 'severity', width: 60, align: 'left' },
          { id: 'filePath', width: 140, align: 'left' },
          { id: 'location', width: 60, align: 'center' },
          { id: 'ruleId', width: 120, align: 'left' },
          { id: 'message', width: 290, align: 'left' },
        ],
      };
      const cellPadding = 5;

      const drawTableForIssues = (title, issueList) => {
        const totalTableWidth = table.columns.reduce(
          (sum, col) => sum + col.width,
          0
        );
        const tablePageWidth =
          doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const tableStartX =
          doc.page.margins.left + (tablePageWidth - totalTableWidth) / 2;

        if (doc.y + 45 > doc.page.height - doc.page.margins.bottom)
          doc.addPage();

        const drawTableHeader = isFirstHeader => {
          if (isFirstHeader) {
            const titleStartY = doc.y;
            doc
              .rect(tableStartX, titleStartY, totalTableWidth, 25)
              .fillAndStroke('#4A5568', '#333333');
            doc
              .font('Helvetica-Bold')
              .fontSize(12)
              .fillColor('white')
              .text(title, tableStartX, titleStartY + 7, {
                width: totalTableWidth,
                align: 'center',
              });
            doc.y = titleStartY + 25;
          }
          const startY = doc.y;
          let startX = tableStartX;
          doc.font('Helvetica-Bold').fontSize(9);
          table.columns.forEach((column, i) => {
            doc
              .rect(startX, startY, column.width, 20)
              .fillAndStroke('#e0e0e0', '#aaaaaa');
            doc
              .fillColor('black')
              .text(
                table.headers[i],
                startX + cellPadding,
                startY + cellPadding,
                { width: column.width - cellPadding * 2, align: column.align }
              );
            startX += column.width;
          });
          doc.y = startY + 20;
        };
        drawTableHeader(true);
        issueList.forEach((issue, index) => {
          doc.font('Helvetica').fontSize(8);
          const rowData = [
            index + 1,
            issue.severity,
            issue.filePath,
            `${issue.line}:${issue.column}`,
            issue.ruleId,
            issue.message,
          ];
          let rowHeight = 0;
          table.columns.forEach((column, i) => {
            const cellHeight = doc.heightOfString(rowData[i].toString(), {
              width: column.width - cellPadding * 2,
            });
            rowHeight = Math.max(rowHeight, cellHeight);
          });
          rowHeight += cellPadding * 2;
          if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            drawTableHeader(false);
          }
          const startY = doc.y;
          let startX = tableStartX;
          table.columns.forEach((column, i) => {
            doc.rect(startX, startY, column.width, rowHeight).stroke('#aaaaaa');
            let textColor = 'black';
            const cellValue = rowData[i];
            if (column.id === 'severity') {
              if (cellValue === 'Error') textColor = 'red';
              else if (cellValue === 'Warning') textColor = '#b45309';
            }
            doc
              .fillColor(textColor)
              .text(
                cellValue.toString(),
                startX + cellPadding,
                startY + cellPadding,
                { width: column.width - cellPadding * 2, align: column.align }
              );
            startX += column.width;
          });
          doc.y = startY + rowHeight;
        });
      };
      if (errors.length > 0)
        drawTableForIssues(`Errors (${errors.length})`, errors);
      if (warnings.length > 0) {
        if (errors.length > 0) doc.moveDown(2);
        drawTableForIssues(`Warnings (${warnings.length})`, warnings);
      }
    }
    doc.end();
  } catch (err) {
    console.error('❌ [createPdfReport] Failed to create PDF report:', err);
    doc.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  runEslintInProject,
  createCsvReport,
  createPdfReport,
};
