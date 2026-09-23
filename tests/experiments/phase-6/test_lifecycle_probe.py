#!/usr/bin/env python3

import importlib.util
from pathlib import Path
import unittest


SPEC = importlib.util.spec_from_file_location("lifecycle_probe", Path(__file__).with_name("lifecycle_probe.py"))
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class LifecycleProbeTests(unittest.TestCase):
    def test_summarizes_only_event_metadata_without_overclaiming(self):
        raw = b'{"event":"SessionStart","source":"compact"}\n{"event":"UserPromptSubmit","source":null}\n'
        result = MODULE.summarize(raw)
        self.assertEqual(result["records"], 2)
        self.assertEqual(result["counts"]["SessionStart:compact"], 1)
        self.assertEqual(result["conclusion"], "INSUFFICIENT_EVIDENCE")

    def test_rejects_extra_payload_fields(self):
        with self.assertRaisesRegex(ValueError, "invalid_shape"):
            MODULE.summarize(b'{"event":"SessionStart","source":"compact","prompt":"secret"}\n')

    def test_rejects_unknown_events(self):
        with self.assertRaisesRegex(ValueError, "unknown_event"):
            MODULE.summarize(b'{"event":"MadeUp","source":null}\n')


if __name__ == "__main__":
    unittest.main()
