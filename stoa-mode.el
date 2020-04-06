;;; stoa-mode.el --- Major mode for *.stoa files -*- lexical-binding: t; -*-
;;
;;; Commentary:
;;
;;; Code:
(require 'generic-x)

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
  "Major mode for Stoa program text highlighting.")

(load! "./stoa-repl-mode.el")
(add-hook 'stoa-mode-hook #'stoa-repl-mode)

;(setq rtog/mode-repl-alist '((stoa-mode . (let ((default-directory "./bin"))
;                                            (comint-run "stoa")))))


;; (defun stoa-repl ()
;;   "Runs stoa in a screen session in a `term' buffer."
;;   (interactive)
;;   (require 'term)
;;   (let ((termbuf (apply
;;                   'make-term
;;                   "stoa REPL"
;;                   "screen"
;;                   nil
;;                   (split-string-and-unquote "bin/stoa"))))
;;     (set-buffer termbuf)
;;     (term-mode)
;;     (term-char-mode)
;;     (switch-to-buffer termbuf)))





(provide 'stoa-mode)
;;; stoa-mode.el ends here
