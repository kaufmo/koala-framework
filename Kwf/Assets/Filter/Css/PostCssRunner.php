<?php
class Kwf_Assets_Filter_Css_PostCssRunner
{
    public static function run($pluginsInitCode, Kwf_SourceMaps_SourceMap $sourcemap)
    {
        $js  = "
            require('es6-promise').polyfill(); //required for older nodejs
            var postcss = require('postcss');
            var plugins = [];
            ".$pluginsInitCode."
            var instance = postcss( plugins );
            var css = '';
            process.stdin.setEncoding('utf-8')
            process.stdin.on('data', function(buf) { css += buf.toString(); });
            process.stdin.on('end', function() {
                instance.process(css).then(function (result) {
                    process.stdout.write(result.css);
                }).catch(function(e) {
                    console.log(e);
                    process.exit(1);
                });
            });
            process.stdin.resume();
        ";
        $runfile = tempnam("temp/", 'postcss');
        file_put_contents($runfile, $js);

        putenv("NODE_PATH=".getcwd()."/".KWF_PATH."/node_modules".PATH_SEPARATOR.getcwd()."/".KWF_PATH);
        $cmd = getcwd()."/".VENDOR_PATH."/bin/node ".$runfile;
        $cmd .= " 2>&1";
        $process = new Symfony\Component\Process\Process($cmd);

        $mapData = $sourcemap->getMapContentsData(false);
        $hasSourcemap = !!$mapData->mappings;
        if ($hasSourcemap) {
            $process->setInput($sourcemap->getFileContentsInlineMap(false));
        } else {
            $process->setInput($sourcemap->getFileContents());
        }

        if ($process->run() !== 0) {
            throw new Kwf_Exception("Process '$cmd' failed with ".$process->getExitCode()."\n".$process->getOutput());
        }
        putenv("NODE_PATH=");
        unlink($runfile);

        $out = $process->getOutput();
        if (Kwf_SourceMaps_SourceMap::hasInline($out)) {
            $ret = Kwf_SourceMaps_SourceMap::createFromInline($out);
        } else {
            $ret = Kwf_SourceMaps_SourceMap::createEmptyMap($out);
            $ret->setMimeType('text/css');
        }
        $ret->setSources($sourcemap->getSources());
        return $ret;
    }

}
