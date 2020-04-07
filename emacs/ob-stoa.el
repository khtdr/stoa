;;; ob-stoa.el --- org-babel functions for stoa evaluation
;;
;;; Commentary:
;;
;;; Code:
(require 'ob)
(require 'ob-eval)

;; Define a file extension for this language.
(add-to-list 'org-babel-tangle-lang-exts '("stoa" . "stoa"))

;; Declare default header arguments for this language.
(defvar org-babel-default-header-args:stoa '())

;; This is the main function which is called to evaluate a code block.
(defun org-babel-execute:stoa (source-code _params)
  "Execute a block of Stoa SOURCE-CODE with org-babel.
This function is called by `org-babel-execute-src-block'"
  (message "executing Stoa source code block")
  ;; adjust as needed
  (org-babel-eval "stoa" source-code))

(provide 'ob-stoa)
;;; ob-stoa.el ends here
