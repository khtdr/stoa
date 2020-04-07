;;; stoa-mode.el --- Major mode for *.stoa files -*- lexical-binding: t; -*-
;;
;;; Commentary:
;;
;;; Code:
(define-generic-mode 'stoa-mode
  '(";;" "\n")
  '()
  '(
    ("[:.]"        . font-lock-reference-face)
    ("[()]"        . font-lock-reference-face)
    ("=>"          . font-lock-function-name-face)
    ("<-"          . font-lock-function-name-face)
    ("~~"          . font-lock-function-name-face)
    ("[?#= +-/*]"  . font-lock-function-name-face)
    ("[0-9]+"      . font-lock-constant-face)
    ("[^ \t\n]"    . font-lock-type-face)
    )
  '("\\.stoa\\'")
  '((lambda () (setq mode-name "stoa")))
  "Major mode for Stoa source code highlighting.")

(provide 'stoa-mode)
;;; stoa-mode.el ends here
