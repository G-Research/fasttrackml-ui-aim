[![FastTrackML banner](https://fasttrackml.io/images/github-banner.svg)](https://fasttrackml.io/)

# fasttrackml-ui-aim

Modern Aim UI built for FastTrackML

## How is the repo working?

The `main` branch only contains Go code and CI workflows.

The `release/vX.Y.Z` branches fork from the `main` branch and add the Aim UI source code, imported [automatically](#how-to-import-a-new-upstream-version) from the [upstream repo](https://github.com/aimhubio/aim). [Further customization](#how-to-customize-the-ui) of the UI happens there.

The `vX.Y.Z` tags contain the built UI and the Go code only.

### How to import a new upstream version?

Add/update the file `upstream.txt` in the `main` branch via pull request. Once merged, the CI will run and create a new `release/vX.Y.Z` branch for you with the imported source code.

### How to customize the UI?

Start from the appropriate `release/vX.Y.Z` and make your changes. You can build the UI by going into the `builder` directory and running the following command:
```
go run main.go
```
An embed directory will be created with the built UI, ready to be embedded in the FastTrackML server via [Go workspaces](https://go.dev/blog/get-familiar-with-workspaces).

Once you're happy with them, create a pull request **against the `release/vX.Y.Z` branch*** that you started from (***not `main`!***). Once merged, the CI will run and build the UI. It will then push it to a new tag that is compatible with the Go module rules. For example, the first customization to `v3.16.2` of Aim will end up in a tag named `v0.31602.1`.

### How is this all enforced?

A GitHub app has been created with the `contents:write` permissions on this repo. Its App ID and private key are stored as secrets under the `restricted` environment. This environment is limited to the `main` and `release/v*` branches

Rulesets have been created to enforce that:
- `main` and `release/v*` branches require pull request reviews
- the GitHub app can create new `release/v*` branches
- the GitHub app can create new `v*` tags
- everything else (branch creation or deletion) is denied

Here is what they look like with the GitHub API at the time of writing:
```json
[
  {
    "name": "App can create release branches",
    "target": "branch",
    "conditions": {
      "ref_name": {
        "exclude": [],
        "include": [
          "refs/heads/release/v*"
        ]
      }
    },
    "rules": [
      {
        "type": "creation"
      }
    ],
    "bypass_actors": [
      {
        "actor_id": 0,
        "actor_type": "Integration",
        "bypass_mode": "always"
      }
    ]
  },
  {
    "name": "App can create version tags",
    "target": "tag",
    "conditions": {
      "ref_name": {
        "exclude": [],
        "include": [
          "refs/tags/v*"
        ]
      }
    },
    "rules": [
      {
        "type": "creation"
      }
    ],
    "bypass_actors": [
      {
        "actor_id": 0,
        "actor_type": "Integration",
        "bypass_mode": "always"
      }
    ]
  },
  {
    "name": "Block creations and updates for all other branches",
    "target": "branch",
    "conditions": {
      "ref_name": {
        "exclude": [
          "refs/heads/main",
          "refs/heads/release/v*"
        ],
        "include": []
      }
    },
    "rules": [
      {
        "type": "creation"
      },
      {
        "type": "update"
      }
    ],
    "bypass_actors": []
  },
  {
    "name": "Block creations for all other tags",
    "target": "tag",
    "conditions": {
      "ref_name": {
        "exclude": [
          "refs/tags/v*"
        ],
        "include": []
      }
    },
    "rules": [
      {
        "type": "creation"
      }
    ],
    "bypass_actors": []
  },
  {
    "name": "Block force pushes and deletions for all branches",
    "target": "branch",
    "conditions": {
      "ref_name": {
        "exclude": [],
        "include": [
          "~ALL"
        ]
      }
    },
    "rules": [
      {
        "type": "deletion"
      },
      {
        "type": "non_fast_forward"
      }
    ],
    "bypass_actors": []
  },
  {
    "name": "Block force pushes, updates and deletions for all tags",
    "target": "tag",
    "conditions": {
      "ref_name": {
        "exclude": [],
        "include": [
          "~ALL"
        ]
      }
    },
    "rules": [
      {
        "type": "deletion"
      },
      {
        "type": "non_fast_forward"
      },
      {
        "type": "update"
      }
    ],
    "bypass_actors": []
  },
  {
    "name": "Require pull request reviews and linear history for main branch and release branches",
    "target": "branch",
    "conditions": {
      "ref_name": {
        "exclude": [],
        "include": [
          "refs/heads/main",
          "refs/heads/release/v*"
        ]
      }
    },
    "rules": [
      {
        "type": "required_linear_history"
      },
      {
        "type": "pull_request",
        "parameters": {
          "require_code_owner_review": false,
          "require_last_push_approval": true,
          "dismiss_stale_reviews_on_push": true,
          "required_approving_review_count": 1,
          "required_review_thread_resolution": false
        }
      }
    ],
    "bypass_actors": []
  }
]
```

The rules can be exported with the following scripts using [`gh`](https://cli.github.com):
```sh
for rule in $(gh api /repos/G-Research/fasttrackml-ui-aim/rulesets -q '.[].id')
do
  gh api /repos/G-Research/fasttrackml-ui-aim/rulesets/$rule | jq '[{name: .name, target: .target, conditions: .conditions, rules: .rules, bypass_actors: .bypass_actors}]'
done | jq -s add
```