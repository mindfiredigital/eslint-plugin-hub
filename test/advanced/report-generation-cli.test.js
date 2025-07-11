const { exec } = require('child_process');
const fs = require('fs');
const pdfDocument = require('pdfkit');
const { Parser } = require('json2csv');
const path = require('path');

jest.mock('child_process');
jest.mock('fs');
jest.mock('pdfkit');
jest.mock('json2csv');

const {
  createCsvReport,
  createPdfReport,
  runEslintInProject,
} = require('../../bin/report-generation-cli.js');

const mockPdfDoc = {
  on: jest.fn(),
  image: jest.fn(),
  fontSize: jest.fn().mockReturnThis(),
  font: jest.fn().mockReturnThis(),
  fillColor: jest.fn().mockReturnThis(),
  text: jest.fn().mockReturnThis(),
  moveDown: jest.fn().mockReturnThis(),
  rect: jest.fn().mockReturnThis(),
  fillAndStroke: jest.fn().mockReturnThis(),
  stroke: jest.fn().mockReturnThis(),
  pipe: jest.fn(),
  end: jest.fn(),
  page: {
    width: 841.89,
    height: 595.28,
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
  },
  y: 50,
  x: 30,
  widthOfString: jest.fn().mockReturnValue(100),
  heightOfString: jest.fn().mockReturnValue(12),
};

describe('ESLint Report CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(true);
    fs.rmSync.mockClear();
    fs.mkdirSync.mockClear();
    fs.writeFileSync.mockClear();
    exec.mockClear();
    pdfDocument.mockImplementation(() => mockPdfDoc);
    Parser.mockImplementation(() => ({
      parse: jest.fn(data => JSON.stringify(data)),
    }));
  });

  describe('runEslintInProject', () => {
    it('should resolve with parsed JSON when eslint finds issues', async () => {
      const mockEslintOutput = JSON.stringify([
        {
          filePath: 'test-file.js',
          messages: [
            {
              ruleId: 'no-unused-vars',
              severity: 2,
              line: 1,
              column: 1,
              message: 'Error message',
            },
          ],
        },
      ]);

      exec.mockImplementation((command, options, callback) => {
        callback(null, mockEslintOutput, '');
      });

      const results = await runEslintInProject('/fake/project');
      expect(results).toHaveLength(1);
      expect(results[0].filePath).toBe('test-file.js');
      expect(exec).toHaveBeenCalledWith(
        expect.stringContaining('eslint.cmd" --format json'),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should resolve with an empty array when no issues are found', async () => {
      // Mock `exec` to simulate a successful run with no output
      exec.mockImplementation((command, options, callback) => {
        callback(null, '[]', '');
      });

      const results = await runEslintInProject('/fake/project');
      expect(results).toEqual([]);
    });

    it('should reject when the eslint command fails', async () => {
      const error = new Error('ESLint command failed');
      const stderr = 'A critical error occurred.';
      exec.mockImplementation((command, options, callback) => {
        callback(error, '', stderr);
      });

      await expect(runEslintInProject('/fake/project')).rejects.toContain(
        stderr
      );
    });
  });

  describe('createPdfReport', () => {
    it('should generate a PDF with a title and table for issues', async () => {
      const issues = [
        {
          severity: 'Error',
          filePath: 'a.js',
          line: 1,
          column: 2,
          ruleId: 'rule1',
          message: 'message1',
        },
        {
          severity: 'Warning',
          filePath: 'b.js',
          line: 3,
          column: 4,
          ruleId: 'rule2',
          message: 'message2',
        },
      ];

      await createPdfReport(issues, '/fake/report-dir');

      expect(pdfDocument).toHaveBeenCalled();

      expect(mockPdfDoc.text).toHaveBeenCalledWith(
        'ESLint Issues Report',
        expect.any(Number),
        expect.any(Number)
      );

      expect(mockPdfDoc.text).toHaveBeenCalledWith(
        expect.stringContaining('Errors (1)'),
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({ align: 'center' })
      );

      expect(mockPdfDoc.text).toHaveBeenCalledWith(
        expect.stringContaining('Warnings (1)'),
        expect.any(Number),
        expect.any(Number),
        expect.any(Object)
      );

      expect(mockPdfDoc.end).toHaveBeenCalled();
    });

    it('should generate a PDF stating no issues were found', async () => {
      await createPdfReport([], '/fake/report-dir');

      expect(mockPdfDoc.text).toHaveBeenCalledWith('No linting issues found.', {
        align: 'center',
      });
      expect(mockPdfDoc.end).toHaveBeenCalled();
    });
  });

  describe('createCsvReport', () => {
    it('should write issues to a CSV file', async () => {
      const issues = [
        {
          severity: 'Error',
          filePath: 'a.js',
          line: 1,
          column: 2,
          ruleId: 'rule1',
          message: 'message1',
        },
      ];

      await createCsvReport(issues, '/fake/report-dir');

      expect(Parser).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/fake/report-dir', 'report.csv'),
        expect.any(String)
      );
    });

    it('should write a "no issues" message to the CSV file', async () => {
      await createCsvReport([], '/fake/report-dir');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/fake/report-dir', 'report.csv'),
        'No linting issues found.'
      );
    });
  });
});
