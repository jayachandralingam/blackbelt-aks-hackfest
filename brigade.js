const { events, Job, Group } = require("brigadier")

events.on("push", function(e, project) => {
  var clone = new Job("clone", "alpine/git:latest")
  clone.tasks = [
    "cd /mnt/brigade/share",
    "git clone " + project.repo.cloneUrl"
  ]
  var scan = new Job("scan", "owasp/dependency-check:latest", ["./bin/dependency-check.sh --project brigade-push-scan --out . --scan /mnt/brigade/share/" + project.repo.name])
  var report = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])
  report.env = {
    SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
    SLACK_USERNAME: "DependencyCheckBot",
    SLACK_layout: post
categories: blog
title: "Vulnerable Dependency Identified in " + project.repo.name,
    SLACK_MESSAGE: "A vulnerable dependency was found in " + project.repo.name + " and <parse what you want>"
  }
  clone.storage.enabled = true
  scan.storage.enabled = true
  var runGroup = new Group()
  runGroup.add(clone)
  runGroup.add(scan)
  runGroup.add(report)
  runGroup.runAll()
})
