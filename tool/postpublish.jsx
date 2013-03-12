import "js/nodejs.jsx";
import "console.jsx";

class _Main {
    static function main(args : string[]) : void {
        var p = node.require(process.cwd() + "/package.json");
        var version = "v" + p["version"] as string;

        // git tag VERSION
        console.log("> git tag " + version);
        node.child_process.execFile("git", ["tag", version], (err, stdout, stderr) -> {
            if (err) {
                console.error(err.toString());
                process.exit(0);
            }

            if(stdout) {
                process.stdout.write(stdout);
            }
            if (stderr) {
                process.stderr.write(stderr);
            }

            // git push origin VERSION
            console.log("> git push origin " + version);
            node.child_process.execFile("git", ["push", "origin", version], (err, stdout, stderr) -> {
                if (err) {
                    console.error(err.toString());
                    process.exit(0);
                }
                if(stdout) {
                    process.stdout.write(stdout);
                }
                if (stderr) {
                    process.stderr.write(stderr);
                }
            });
        });
    }
}

// vim: set expandab:
