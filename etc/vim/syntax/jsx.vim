" Vim syntax file
" Language:	JSX
" Maintainer:	

" For version 5.x: Clear all syntax items
" For version 6.x: Quit when a syntax file was already loaded
" tuning parameters:

if !exists("main_syntax")
  if version < 600
    syntax clear
  elseif exists("b:current_syntax")
    finish
  endif
  let main_syntax = 'jsx'
endif

" Drop fold if it set but vim doesn't support it.
if version < 600 && exists("jsx_fold")
  unlet jsx_fold
endif


syn keyword jsxCommentTodo	TODO FIXME XXX TBD contained
syn match   jsxLineComment	"\/\/.*" contains=@Spell,jsxCommentTodo
syn match   jsxCommentSkip	"^[ \t]*\*\($\|[ \t]\+\)"
syn region  jsxComment		start="/\*"  end="\*/" contains=@Spell,jsxCommentTodo
syn match   jsxSpecial	       "\\\d\d\d\|\\."
syn region  jsxStringD	       start=+"+  skip=+\\\\\|\\"+  end=+"\|$+	contains=jsxSpecial,@htmlPreproc
syn region  jsxStringS	       start=+'+  skip=+\\\\\|\\'+  end=+'\|$+	contains=jsxSpecial,@htmlPreproc

syn match   jsxSpecialCharacter	"'\\.'"
syn match   jsxNumber		 "-\=\<\d\+L\=\>\|0[xX][0-9a-fA-F]\+\>"
syn keyword jsxSpecialNumbers	NaN Infinity
syn region  jsxRegexpString	start=+/[^/*]+me=e-1 skip=+\\\\\|\\/+ end=+/[gi]\{0,2\}\s*$+ end=+/[gi]\{0,2\}\s*[;.,)\]}]+me=e-1 contains=@htmlPreproc oneline

syn keyword jsxConditional	if else switch
syn keyword jsxRepeat		while for do in
syn keyword jsxBranch		break continue
syn keyword jsxOperator		new delete instanceof typeof as __noconvert__
syn keyword jsxType		Array boolean Boolean Date number Number Map int Object string String RegExp JSON MayBeUndefined variant void
syn keyword jsxStatement	return
syn keyword jsxBoolean		true false
syn keyword jsxNull		null undefined
syn keyword jsxIdentifier	this var const
syn keyword jsxLabel		case default
syn keyword jsxException	try catch finally throw
syn keyword jsxClass		class interface mixin
syn keyword jsxModifiers	final override native __fake__ extends abstract static implements
syn keyword jsxImport		import from
syn keyword jsxEntryPoint	_Main _Test main
syn keyword jsxReserved		byte char double enum export float goto import long package private protected public short synchronized throws transient volatile arguments
syn keyword jsxDebug		debugger assert log

if exists("jsx_fold")
    syn match	jsxFunction	"\<function\>"
    syn region	jsxFunctionFold	start="\<function\>.*[^};]$" end="^\z1}.*$" transparent fold keepend

    syn sync match jsxSync	grouphere jsxFunctionFold "\<function\>"
    syn sync match jsxSync	grouphere NONE "^}"

    setlocal foldmethod=syntax
    setlocal foldtext=getline(v:foldstart)
else
    syn keyword jsxFunction	function
    syn match	jsxBraces	"[{}\[\]]"
    syn match	jsxParens	"[()]"
endif

syn sync fromstart
syn sync maxlines=100

if main_syntax == "jsx"
  syn sync ccomment jsxComment
endif

" Define the default highlighting.
" For version 5.7 and earlier: only when not done already
" For version 5.8 and later: only when an item doesn't have highlighting yet
if version >= 508 || !exists("did_jsx_syn_inits")
  if version < 508
    let did_jsx_syn_inits = 1
    command -nargs=+ HiLink hi link <args>
  else
    command -nargs=+ HiLink hi def link <args>
  endif

  HiLink jsxComment		Comment
  HiLink jsxLineComment		Comment
  HiLink jsxCommentTodo		Todo
  HiLink jsxSpecial		Special
  HiLink jsxStringS		String
  HiLink jsxStringD		String
  "HiLink jsxCharacter		Character
  HiLink jsxSpecialCharacter	jsxSpecial
  HiLink jsxNumber		Number
  HiLink jsxSpecialNumbers	Constant
  HiLink jsxConditional		Conditional
  HiLink jsxRepeat		Repeat
  HiLink jsxBranch		Conditional
  HiLink jsxOperator		Operator
  HiLink jsxType		Type
  HiLink jsxStatement		Statement
  HiLink jsxFunction		Function
  HiLink jsxBraces		Function
  HiLink jsxError		Error
  HiLink jsParenError		jsxError
  HiLink jsxNull		Keyword
  HiLink jsxBoolean		Boolean
  HiLink jsxRegexpString	String

  HiLink jsxIdentifier		Identifier
  HiLink jsxLabel		Label
  HiLink jsxException		Exception
  HiLink jsxClass		Structure
  HiLink jsxModifiers		Keyword
  HiLink jsxImport		Keyword
  HiLink jsxEntryPoint		Keyword
  HiLink jsxReserved		Keyword
  HiLink jsxDebug		Debug

  delcommand HiLink
endif

let b:current_syntax = 'jsx'
if main_syntax == 'jsx'
  unlet main_syntax
endif

" vim: ts=8
" vim: noexpandtab
