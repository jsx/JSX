#!/bin/sh
# try: cp tool/git-hooks-pre-push .git/hooks/pre-push
set -xe
make compiler
perl -Mlib=extlib/lib/perl5 extlib/bin/prove t/009.self-hosting.t
