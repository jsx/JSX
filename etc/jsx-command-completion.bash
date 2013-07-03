# bash completion for jsx(1)

_jsx_command_complete()
{
    local cur prev optimize
    optimize="lto no-assert no-log no-debug staticize fold-const return-if inline dce unbox fold-const lcse dce fold-const array-length unclassify"

    COMPREPLY=()
    cur=${COMP_WORDS[COMP_CWORD]}
    prev=${COMP_WORDS[COMP_CWORD-1]}
    JSX_OPTIONS='\
        --add-search-path\
        --executable\
        --run\
        --test\
        --output\
        --input-filename\
        --mode\
        --target\
        --release\
        --minify\
        --profile\
        --optimize\
        --enable-type-check\
        --enable-source-map\
        --version\
        --help'

    case $prev in
      --add-search-path)
        COMPREPLY=($( compgen -d -- $cur ))
        ;;
      --executable)
        COMPREPLY=($( compgen -W "web node" -- $cur ))
        ;;
      --output)
        COMPREPLY=($( compgen -W "FILE" -- $cur ))
        ;;
      --mode)
        COMPREPLY=($( compgen -W "compile parse doc" -- $cur ))
        ;;
      --target)
        COMPREPLY=($( compgen -W "javascript c++" -- $cur ))
        ;;
      --optimize)
        COMPREPLY=($( compgen -W "$optimize" -- $cur ))
        ;;
      *)
        COMPREPLY=($( compgen -W "$JSX_OPTIONS" -f -- $cur ))
        ;;
    esac

    return 0
}
complete -F _jsx_command_complete jsx

