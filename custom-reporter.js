import { Chalk } from 'chalk';

const chalk = new Chalk({ level: 3 });

export default class CustomReporter {
  onRunComplete(_testContexts, results) {
    console.log();

    const data = extractTestsData(results);

    printTests(data.tests);
  }
}

function extractTestsData(results) {
  const failedSuites = results.numFailedTestSuites;
  const failedTests = results.numFailedTests;
  const passedSuites = results.numPassedTestSuites;
  const passedTests = results.numPassedTests;
  const totalSuites = results.numTotalTestSuites;
  const totalTests = results.numTotalTests;

  const tests = [];
  let workingResults = [results];

  let currentFilePath = '';

  while (workingResults.length > 0) {
    const currentResult = workingResults.pop();

    if (hasTestResults(currentResult)) {
      if (currentResult.testFilePath) {
        currentFilePath = currentResult.testFilePath;
      }
      workingResults = [...workingResults, ...currentResult.testResults];
      continue;
    }

    tests.push(parseTestData(currentResult, currentFilePath));
  }

  return {
    tests,
    failedSuites,
    failedTests,
    passedSuites,
    passedTests,
    totalSuites,
    totalTests,
  };
}

function hasTestResults(result) {
  return Boolean(result.testResults);
}

function parseTestData(test, filePath = undefined) {
  const title = test.title;
  const ancestorTitles = test.ancestorTitles;
  const status = test.status;
  const duration = test.duration;

  const matcherResult = test.failureDetails?.[0]?.matcherResult;

  return { title, ancestorTitles, status, duration, matcherResult, filePath };
}

function printTests(tests) {
  const root = {
    children: {},
    tests: [],
  };

  for (const test of tests) {
    let currentLevel = root;
    const ancestorTitles = [test.filePath, ...test.ancestorTitles];

    for (let i = 0; i < ancestorTitles.length; i++) {
      const ancestorTitle = ancestorTitles[i];

      const isLastTitle = i === ancestorTitles.length - 1;

      if (!currentLevel.children[ancestorTitle]) {
        currentLevel.children[ancestorTitle] = { children: {}, tests: [] };
      }

      if (isLastTitle) {
        currentLevel.children[ancestorTitle].tests.push(test);
        continue;
      }

      currentLevel = currentLevel.children[ancestorTitle];
    }
  }

  console.log();

  printLevel(root);
}

function indentation(size) {
  return '  '.repeat(size);
}

function printLevel(level, indent = 0, title = undefined) {
  let newIndent = indent;
  if (title) {
    printTitle(title, indent);

    newIndent = indent + 1;
  }

  if (level.tests.length > 0) {
    for (const test of level.tests) {
      printTest(test, newIndent);
    }
  }

  for (const innerTitle of Object.keys(level.children)) {
    printLevel(level.children[innerTitle], newIndent, innerTitle);
  }
}

function printTitle(title, indentSize) {
  console.log(indentation(indentSize) + chalk.rgb(156, 163, 175)(title));
}

function printTest(test, indentSize) {
  const icon = test.status === 'failed' ? chalk.red('✕') : chalk.green('✓');

  if (test.status === 'failed') {
    const prefix = `${icon} `;
    const suffix = ` ${chalk.rgb(55, 65, 81)(`${test.duration}ms`)}`;

    console.log(
      `${indentation(indentSize)}${prefix}${chalk.rgb(
        209,
        213,
        219,
      )(test.title)}${suffix}`,
    );
    console.log(
      `${indentation(indentSize + 2)}${chalk
        .rgb(107, 114, 128)
        .italic('Expected:')} ${chalk.greenBright(
        `${test.matcherResult.expected}`,
      )}`,
    );
    console.log(
      `${indentation(indentSize + 2)}${chalk
        .rgb(107, 114, 128)
        .italic('Received:')} ${chalk.redBright(
        `${test.matcherResult.actual}`,
      )}`,
    );
    return;
  }

  const prefix = `${icon} `;
  const suffix = ` ${chalk.rgb(55, 65, 81)(`${test.duration}ms`)}`;

  console.log(
    `${indentation(indentSize)}${prefix}${chalk.rgb(
      107,
      114,
      128,
    )(test.title)}${suffix}`,
  );
}
