;;; stoa-repl-mode.el --- description -*- lexical-binding: t; -*-
;;
;; Copyright https://github.com/manute/gorepl-mode
;; Copyright (C) 2020 Oh Kay
;;
;; Author: Oh Kay <http://github/jdm>
;; Maintainer: Oh Kay <khtdr.com@gmail.com>
;; Created: April 05, 2020
;; Modified: April 05, 2020
;; Version: 0.0.1
;; Keywords:
;; Homepage: https://github.com/jdm/stoa-repl-mode
;; Package-Requires: ((emacs 27.0.90) (cl-lib "0.5"))
;;
;; This file is not part of GNU Emacs.
;;
;;; Commentary:
;;
;;  description
;;
;;; Code:

(require 's)
(require 'f)
(require 'hydra)

(defgroup stoa-repl nil
  "stoa repl interactive"
  :prefix "stoa-repl-"
  :group 'applications
  :link '(url-link :tag "Github" "https://github.com/khtdr/stoa")
  :link '(emacs-commentary-link :tag "Commentary" "stoa-repl"))

(defcustom stoa-repl-command "bin/stoa"
  "The command used to execute stoa."
  :type 'string
  :group 'stoa-repl)


(defcustom stoa-repl-mode-hook nil
  "Hook called by `stoa-repl-mode'."
  :type 'hook
  :group 'stoa-repl)


(defconst stoa-repl-version "1.0.1")
(defconst stoa-repl-buffer "*stoa REPL*")
(defconst stoa-repl-buffer-name "stoa REPL")


;; MANY THANKS to masteringenmacs for this:
;; https://www.masteringemacs.org/article/comint-writing-command-interpreter
(defun stoa-repl--run-stoa (args)
  "Run an inferior instance of `stoa' inside Emacs."
  (let* ((buffer (comint-check-proc stoa-repl-buffer-name)))
    ;; pop to the "*GO REPL Buffer*" buffer if the process is dead, the
    ;; buffer is missing or it's got the wrong mode.
    (display-buffer
     (if (or buffer (not (derived-mode-p 'stoa-repl-mode))
             (comint-check-proc (current-buffer)))
         (get-buffer-create (or buffer stoa-repl-buffer))
       (current-buffer)))
    ;; create the comint process if there is no buffer.
    (unless buffer
      (apply 'make-comint-in-buffer stoa-repl-buffer-name buffer
             stoa-repl-command nil args)
      (stoa-repl-mode))))


;;;;;;;;;;;;;;;;;;;;;;;
;; API
;;;;;;;;;;;;;;;;;;;;;;

(defun stoa-repl-version ()
  "Display Stoa-Repl's version."
  (interactive)
  (message "STOA-REPL %s" stoa-repl-version))

(defun stoa-repl-run ()
  "Start or switch to the Stoa-Repl buffer"
  (interactive)
  (message "Entering stoa session...")
  (stoa-repl--run-stoa '()))

(defun stoa-repl-eval (stmt)
  "Send `stmt' to stoa, maybe starting it"
  (interactive)
  (stoa-repl-run)
  (with-current-buffer stoa-repl-buffer
    (insert stmt)
    (comint-send-input)
    (message (format "Just sent to stoa: %s" stmt))))

(defun stoa-repl-eval-region (begin end)
  "Evaluate region selected."
  (interactive "r")
  (stoa-repl-mode t)
  (let ((cmd (buffer-substring begin end)))
    (stoa-repl-eval cmd)))

(defun stoa-repl-eval-line (&optional arg)
  "Evaluate current line."
  (interactive "P")
  (unless arg
    (setq arg 1))
  (when (> arg 0)
    (stoa-repl-eval-region
     (line-beginning-position)
     (line-end-position arg))))

(defun stoa-repl-run-load-current-file ()
  "Run a Stoa-Repl with a context file in it"
  (interactive)
  (stoa-repl--run-stoa (list "-context" (buffer-file-name))))

(defun stoa-repl-quit ()
  "Quit"
  (interactive)
  (if (comint-check-proc stoa-repl-buffer)
      (let ((stmt ";; > quit"))
        (stoa-repl-eval stmt))
    (message "stoa is already stopped")))

(defun stoa-repl-restart ()
  "Restart stoa. In others words: start a fresh stoa session."
  (interactive)
  (stoa-repl-quit)
  (sleep-for 1)
  (stoa-repl-run))

(defun stoa-repl-eval-line-goto-next-line ()
  "Evaluate this line and move to next."
  (interactive)
  (call-interactively 'stoa-repl-eval-line)
  (call-interactively 'next-logical-line))

(defhydra stoa-repl-hydra (:color teal :hint nil)
  "
^(Go RE)PL
 Run^              ^| ^Eval^         | ^REPL^
-^-----------------^+--------------+------------------------------------
 _d_: Run empty     | _j_: Selection | _r_: Restart this REPL
 _f_: Run this file | _k_: Line+Step | _p_: Quit this REPL (or C-d)
 _q_: Quit Hydra    | _K_: Line      |
"
  ("d" stoa-repl-run)
  ("f" stoa-repl-run-load-current-file)
  ("j" stoa-repl-eval-region)
  ("r" stoa-repl-restart)
  ("k" stoa-repl-eval-line-goto-next-line :exit nil)
  ("K" stoa-repl-eval-line)
  ("p" stoa-repl-quit)
  ("q" nil))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; DEFINE MINOR MODE
;;
;; Many thanks -> https://github.com/ruediger/rusti.el
;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defvar stoa-repl-mode-map
  (let ((map (make-sparse-keymap)))
            (define-key map (kbd "C-c C-g") #'stoa-repl-run)
            (define-key map (kbd "C-c C-l") #'stoa-repl-run-load-current-file)
            (define-key map (kbd "C-c C-e") #'stoa-repl-eval-region)
            (define-key map (kbd "C-c C-r") #'stoa-repl-eval-line)
            map)
  "Mode map for `stoa-repl-mode'.")
(setq rtog/mode-repl-alist '((stoa-mode . stoa-repl-run)))

(defcustom stoa-repl-mode-lighter " Stoa-Repl"
  "Text displayed in the mode line (Lighter) if `stoa-repl-mode' is active."
  :group 'stoa-repl
  :type 'string)

;;;###autoload
(define-minor-mode stoa-repl-mode
  "A minor mode for run a go repl on top of stoa"
  :group 'stoa-repl
  :lighter stoa-repl-mode-lighter
  :keymap stoa-repl-mode-map)

;; enable stoa for in-buffer evaluation
(org-babel-do-load-languages
 'org-babel-load-languages
 '((stoa . t)))
(setq org-babel-stoa-command "bin/stoa")
;; use %cpaste to paste code into ipython in org mode
(defadvice org-babel-stoa-evaluate-session
    (around org-stoa-use-cpaste
            (session body &optional result-type result-params) activate)
  "Add a %cpaste and '--' to the body, so that stoa does the right thing."
  (setq body (concat "%cpaste\n" body "\n--"))
  ad-do-it
  (if (stringp ad-return-value)
      (setq ad-return-value (replace-regexp-in-string
                             "\\(^Pasting code; enter '--' alone on the line to stop or use Ctrl-D\.[\r\n]:*\\)"
                             ""
                             ad-return-value))))

;; all stoa code be safe
;; (defun my-org-confirm-babel-evaluate (lang body)
;; (not (string= lang "stoa")))
;; (setq org-confirm-babel-evaluate nil)

(provide 'stoa-repl-mode)
;;; stoa-repl-mode.el ends here
