STEPS = step0_repl
# step1_read_print step2_eval step3_env \
# 	step4_if_fn_do step5_tco step6_file step7_quote \
# 	step8_macros step9_try stepA_mal

all:
	tsc

node_modules:
	npm install

build/step%.js: node_modules src/*.ts
	tsc


.PHONY: ts clean

clean:
	rm -f build/*.js
