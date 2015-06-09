test:
	node tests/add-tests.js
	node tests/get-tests.js

pushall:
	git push origin master && npm publish
