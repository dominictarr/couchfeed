# couchfeed

Simple alternative to follow for syncing couch change feed.

[![travis](https://travis-ci.org/dominictarr/couchfeed.png?branch=master)
](https://travis-ci.org/dominictarr/couchfeed)

## disclaimer

Okay, so I wrote this because I was seeing follow being very slow to start.
Follow is quite an early node project, and we have all learnt alot since then.
In the process of writing this, I figured out why follow was so slow to start.
(it was because I was stuck on a very large document + slow 3G)

So, I'm back to using follow, since it wasn't actually broken.

Previously, I did seem to see some problems with follow when leaving it running
but switching different networks. My usecase is to sync the npm registry metadata onto
my laptop, which of course, stays running for long periods, but switches networks frequently,
several times a day. I may switch back to this in the future, but for now,
[follow](https://github.com/iriscouch/follow) is tried and tested, if quite large.

## License

MIT
