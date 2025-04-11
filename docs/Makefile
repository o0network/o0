LATEX_COMPILER = pdflatex
LATEX_COMPILER_FLAGS = -interaction=nonstopmode
BIBLIO_COMPILER = bibtex
BIBLIO_COMPILER_FLAGS =

RM = rm -f
TEMPORARY_FILES = *.out *.aux *.blg *.bbl *.toc *.nav *.snm *.log
LOG_FILES = *.log

DOCKER_RUN = docker run
DOCKER_FLAGS = --rm -i -v "${PWD}":/diplom:Z
DOCKER_IMAGE = 2109199812/docker-latex
DOCKER_COMMAND = make release

FILES_TO_BUILD := $(patsubst %.tex,%.pdf,$(wildcard *.tex))

release: clean $(FILES_TO_BUILD) cleanup

diploma:
	$(DOCKER_RUN) $(DOCKER_FLAGS) $(DOCKER_IMAGE) bash -c "make clean && make diploma.pdf && make cleanup"


%.pdf: %.tex
	$(LATEX_COMPILER) $(LATEX_COMPILER_FLAGS) $*
	@if (grep "citation{.*}" $*.aux > /dev/null); then \
		$(BIBLIO_COMPILER) $(BIBLIO_COMPILER_FLAGS) $*; \
		$(LATEX_COMPILER) $(LATEX_COMPILER_FLAGS) $*; \
	fi
	$(LATEX_COMPILER) $(LATEX_COMPILER_FLAGS) $*

clean:
	$(RM) $(FILES_TO_BUILD) $(LOG_FILES) $(TEMPORARY_FILES)

cleanup:
	$(RM) $(TEMPORARY_FILES)

	$(RM) $(TEMPORARY_FILES) $(subst clean_,,$@).pdf
