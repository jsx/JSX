import "js/nodejs.jsx";
import "console.jsx";

class _Main {
    static function main(args : string[]) : void {
        var p = node.require(process.cwd() + "/package.json");
        var tag = "v" + p["version"] as string;

        var dry_run = (args.length > 0 && args[0] == "--dry-run");

        var tasks = [
            ["git", "tag", tag],
            ["git", "push", "origin", tag],
            ["git", "push", "origin", "master"]
        ];

        if (dry_run) {
            tasks.forEach((item) -> {
                item.unshift("echo");
            });
        }

        function runNext(tasks : string[][]) : void {
            if (tasks.length) {
                var task = tasks.shift().slice(0);

                console.log("> " + task.join(" "));
                var cmd = task.shift();
                var args = task;

                node.child_process.execFile(cmd, args, (err, stdout, stderr) -> {
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

                    runNext(tasks);
                });
            }
        }

        runNext(tasks);
    }
}

// vim: set expandtab:
