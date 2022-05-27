# Setup Fastly CLI

> ⏲️A GitHub Action for setting up and configuring the [Fastly command line interface](https://github.com/fastly/cli)

## usage

Create a [Fastly API token](https://manage.fastly.com/account/personal/tokens). These tokens are not meant to be shared. Keep them secret by storing them in your GitHub repository's [actions secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

Add a step to your workflow to install and configure the Fastly CLI

```yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Setup Fastly CLI
      uses: softprops/setup-fastly-cli@v1
      env:
        FASTLY_API_TOKEN: ${{ secrets.FASTLY_API_TOKEN }}
    - name: Enjoy
      run: fastly whoami
```

#### inputs

| Name        | Type    | Description                                                     |
|-------------|---------|-----------------------------------------------------------------|
| `version`      | string  | version of [Fastly cli release](https://github.com/fastly/cli/releases) defaults to latest version                |


#### env

| Name        | Type    | Description                                                     |
|-------------|---------|-----------------------------------------------------------------|
| `FASTLY_API_TOKEN`   | string  | personal [Fastly API token](https://manage.fastly.com/account/personal/tokens)                          |


## alternative usage

This workflow can also be used to only install the Fastly CLI. If you want to use an API token that has a strictly limited permission grant, you will need to use this option.

To do that pass an environment variable `SKIP_CONFIGURE` with any value.  The `FASTLY_API_TOKEN` is not required in this case.

For steps following the installation, you will need to provide the CLI with an API token, by either exporting a `FASTLY_API_TOKEN` environment variable, or by providing it to the CLI explicitly as part of the command line. See the [Fastly CLI documentation](https://developer.fastly.com/reference/cli/#configuring) for details.

### example

```yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Setup Fastly CLI
      uses: softprops/setup-fastly-cli@v1
      env:
        SKIP_CONFIGURE: yes
    - name: Purge Fastly
        FASTLY_API_TOKEN: ${{ secrets.FASTLY_API_TOKEN }}
      run: fastly purge --key "*/beepboop"
```

Doug Tangren (softprops) 2020
