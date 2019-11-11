<?php
/**
 * Runs an npm script when `arc unit` (or `arc diff`) is called.
 * The name of the script is defined in .arcconfig's `npm.run.script` property.
 *
 * If the npm script returns a non-zero return value, that counts as a 'unit test failure',
 * and the output of the script is displayed.
 *
 * IF the npm script returns zero, then the 'unit test' passes and `arc diff` will continue.
 */
final class NpmRunScript extends ArcanistUnitTestEngine {
  /** @Override */
  public function run()
  {
      $console = PhutilConsole::getConsole();


      // Load .arcconfig to find name of npm script we should be running
      $arcconfigPath=$this->getWorkingCopy()->getProjectRoot().'/.arcconfig';
      if (!file_exists($arcconfigPath)) {
        $console->writeOut('ERROR: .arcconfig file not found');
        return [];
      }
      $arcconfig = json_decode(
          Filesystem::readFile($arcconfigPath),
          true
      );
      if (!$arcconfig) {
          $console->writeOut('ERROR: failed to load .arcconfig file');
          return [];
      }
      if (!array_key_exists('npm.run.script', $arcconfig)) {
          $console->writeOut("ERROR: .arcconfig missing 'npm.run.script' option. Defines which npm script to run\n");
          return [];
      }
      $npmScriptName = $arcconfig['npm.run.script'];

      // check the script actually exists..
      $projectJsonPath=$this->getWorkingCopy()->getProjectRoot().'/package.json';
      $projectJson = json_decode(
          Filesystem::readFile($projectJsonPath),
          true
      );
      if (!array_key_exists($npmScriptName, $projectJson['scripts'])) {
          $console->writeOut("ERROR: package.json is missing scripts/$npmScriptName \n");
          return [];
      }

      $console->writeOut("------------------------------\n");
      $console->writeOut("Running: npm run $npmScriptName \n");
      $console->writeOut("------------------------------\n");
      $output = "";
      $return_var_npm = -1;
      exec("npm run $npmScriptName --silent", $output, $return_var_npm);
      $result_array = [];

      if ($return_var_npm != 0) {
          foreach ($output as $line) {
              // Create a failed unit test for each output line - imperfect
              $result = new ArcanistUnitTestResult();
              $result->setName($line);
              $result->setResult(ArcanistUnitTestResult::RESULT_FAIL);
              $result->setDuration(0);
              array_push($result_array,$result);
          }
      }

      // If there are any changes to git, bail out
      // This prevents `arc diff` from failing to push changes made by eslint --fix or prettier etc
      exec("git diff-index --quiet HEAD", $output, $return_var_git);
      if ($return_var_git != 0) {
          // Create a failed unit test for each output line - imperfect
          $result = new ArcanistUnitTestResult();
          $result->setName("git contains uncommitted changes. This may be because the npm script adjusted formatting or fixed eslint issues.");
          $result->setResult(ArcanistUnitTestResult::RESULT_FAIL);
          $result->setDuration(0);
          array_push($result_array,$result);
      }

      $console->writeOut("npm script completed.\n");
      return $result_array;
  }
}
