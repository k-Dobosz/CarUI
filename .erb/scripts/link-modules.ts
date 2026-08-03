import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const { srcNodeModulesPath, appNodeModulesPath, erbNodeModulesPath } =
  webpackPaths;

const createSymlink = (target: string, link: string) => {
  if (fs.existsSync(link) || fs.lstatSync(link, { throwIfNoEntry: false })) {
    fs.rmSync(link, { recursive: true, force: true });
  }

  fs.symlinkSync(target, link, 'junction');
};

if (fs.existsSync(appNodeModulesPath)) {
  createSymlink(appNodeModulesPath, srcNodeModulesPath);
  createSymlink(appNodeModulesPath, erbNodeModulesPath);
}