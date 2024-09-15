import Fs from 'fs';
import * as Glob from 'glob';
import Path from 'path';

import Package from '../package.json' with {type: 'json'};

const PATTERN = 'dist/*';

const paths = Glob.sync(PATTERN);
paths.forEach((path) => {
  const fileName = Path.basename(path);
  if (Fs.statSync(path).isDirectory()) {
    return;
  }

  const ext = fileName.match(/(\..+)$/)[1];
  const base = Path.basename(fileName, ext);
  const versionedPath = Path.join(
    Path.dirname(path),
    `${base}-${Package.version}${ext}`,
  );
  Fs.renameSync(path, versionedPath);
});
